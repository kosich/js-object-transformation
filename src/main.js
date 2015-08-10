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
                let [ path, func ] = mod;
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
    let is_array = /.*\[\*\]/.test(key);

    if (is_array){
        key = key.replace(/\[\*\]/, '');
    }

    let is_root = ('$' === key);

    let value;

    if (is_root){
        value = source;
    } else {
        value = source[key];
    }

    if (is_array){
        let result = [];
        for(let item of value){
            result.push(get_property(item, [].concat(path)));
        }
        return result;
    }

    if (is_root){
        return get_property(value, path);
    }


    // final path part
    if (!path.length){
        return value;
    }

    // TODO: check for drilling into simple value type
    // no way to drill down
    if (undefined  === value || null === value){
        return value;
    }

    return get_property(source[key], path);
}

export default transform;
