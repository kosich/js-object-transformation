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
            // nor will it work with `arguments'
            // use ducktyping instead
            if (mod instanceof Array){
                // syntax for arr-mod is
                // path_1 [,..path_2, .., path_N], function
                let last_index = mod.length - 1; 
                let paths = mod.slice(0, last_index);
                let func = mod[last_index];

                if (!paths.length){
                    throw 'Thou shall pass path';
                }

                let values = paths.map(path=>{
                    path = path.split(/\./);
                    return get_property(source, path);
                });

                return func(...values);
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

    // final path part
    if (0 === path.length){
        return value;
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


    // TODO: check for drilling into simple value type
    // no way to drill down
    if (undefined  === value || null === value){
        return value;
    }

    return get_property(source[key], path);
}

export default transform;
