class CreatFilter{
    rightLike(k,f,filters){
        f = `${k} like '${filters.target}%'`
        return f;
    }
    leftLike(k,f,filters){
        f = `${k} like '%${filters.target}'`
        return f;
    }
    leftLike(k,f,filters){
        f = `${k} like '%${filters.target}%'`
        return f;
    }
    exceed(k,f,filters){
        f = f + `${k} > '${filters.target}'`
        return f;
    }
    exceedOrEqual(k,f,filters){
        f = `${k} >= '${filters.target}'`
        return f;
    }
    below(k,f,filters){
        f = `${k} < '${filters.target}'`
        return f;
    }
    belowOrEqual(k,f,filters){
        f = `${k} <= '${filters.target}'`
        return f;
    }
    between(k,f,filters){
        let fl = filters.fl.split(",")
        f = `${k} between '${fl[1]} and ${fl[2]}'`
        return f;
    }
    execute(k,fnName,f,filters){
        let creatFilter = new CreatFilter();
        return creatFilter[fnName](k,f,filters)
    }
}
module.exports = CreatFilter