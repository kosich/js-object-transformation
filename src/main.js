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

    if (typeof transformation !== 'object'){
        return;
    }

    // TODO: this wont work with multiple globals
    // use ducktyping instead
    if (transformation instanceof Array){
        let path = transformation[0].split(/\./);
        let func = transformation[1];
        return get_property(source, path, func)
    }

    // default subitems gothrough
    let result = transformation;
    Object.keys(transformation).forEach(key=>{
        result[key] = transform(source, transformation[key]);
    });
    return result;
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
