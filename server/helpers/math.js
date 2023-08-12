module.exports.sortTwoNums  = function(a, b){  
    if(a > b)
        return {min: b, max: a}
    else    
        return {min: a, max: b}
}