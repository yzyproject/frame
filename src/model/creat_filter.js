class CreatFilter{
    rightLike(k,f,filters){
        f = `${k} like ?`
        return f;
    }
    leftLike(k,f,filters){
        f = `${k} like ?`
        return f;
    }
    doubleLike(k,f,filters){
        f = `${k} like ?`
        return f;
    }
    exceed(k,f,filters){
        f = f + `${k} > ?`
        return f;
    }
    exceedOrEqual(k,f,filters){
        f = `${k} >= ?`
        return f;
    }
    below(k,f,filters){
        f = `${k} < ?`
        return f;
    }
    belowOrEqual(k,f,filters){
        f = `${k} <= ?`
        return f;
    }
    between(k,f,filters){
        let fl = filters.fl.split(",")
        f = `${k} between?and?`
        return f;
    }
    execute(k,fnName,f,filters){
        let creatFilter = new CreatFilter();
        return creatFilter[fnName](k,f,filters)
    }
}
module.exports = CreatFilter