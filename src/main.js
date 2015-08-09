function transform(source, mod){
    let handler = {
        undefined: ()=>source,
        null: ()=>source,
        function: ()=> mod(source),
        string(){
            let path = mod.split(/\./);
            return get_property(source, path);
        },
        object(){
            // TODO: this wont work with multiple globals
            // use ducktyping instead
            if (mod instanceof Array){
                let [path, func ] = mod;
                path = path.split(/\./);
                let property = get_property(source, path, func);
                if (!func){
                    return property;
                }
                return func(property);
            }

            // default subitems gothrough
            // TODO: might want to make zero object here
            let result = {};
            for(let key of Object.keys(mod)){
                result[key] = transform(source, mod[key]);
            }
            return result;
        }
    };
    
    return handler[typeof mod]();
}


function get_property(source, path){
    let key = path.shift();

    if ('$' === key){
        return get_property(source, path);
    }

    let value = source[key];
    if (!path.length){
        return value;
    }

    // TODO: check for drilling into simple value type
    // no way to drill down
    if (undefined  === value || null === value){
        return undefined;
    }

    return get_property(source[key], path);
}

export default transform;
