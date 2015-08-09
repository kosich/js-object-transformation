function transform(source, transformation){
    if (!transformation){
        return source;
    }

    if (typeof transformation === 'function'){
        return transformation(source);
    }

    if (typeof transformation === 'string'){
        let path = transformation.split(/\./);
        return get_property(source, path);
    }

    let target = transformation;

    Object.keys(transformation).forEach(key=>{

        let value = transformation[ key ];

        if (typeof value === 'string'){
            let path = value.split(/\./);
            let src_value = get_property(source, path);
            target[key] = src_value;
        }

        if (typeof value === 'function'){
            target[key] = value(source);
        }

        if (typeof value === 'object'){
            // TODO: this wont work with multiple globals
            // use ducktyping instead
            if (value instanceof Array){
                let path = value[0].split(/\./);
                let func = value[1];
                target[key] = get_property(source, path, func)
            } else {
                target[key] = transform(source, value);
            }
        }

    });

    return target;
}

function get_property(source, path, func){
    let key = path.splice(0,1)[0];

    if (key === '$'){
        return get_property(source, path, func);
    }

    if (!path.length){
        if (func) return func(source[key]);
        return source[key];
    }

    if (!source[key]){
        return undefined;
    }

    return get_property(source[key], path, func);
}

export default transform;
