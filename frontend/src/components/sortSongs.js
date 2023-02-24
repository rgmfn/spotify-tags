/**
 * 
 * @param {*} reverse 
 * @param {*} primary 
 * @param {*} secondary 
 * @param {*} library 
 * @param {*} mapped 
 * @param {*} setLibrary 
 */
function songSort(reverse, primary, secondary, library, mapped, setLibrary) {
     
     // created to return an anon func. to be used
     // as a callback function for array.prototype.sort()
     mapped.sort(function(a, b){
          let comparison = 0; // will store all the given comparisons

          // sorting by primary attribute
          if (typeof a[primary] === 'string' &&
          typeof b[primary] === 'string') {
               comparison = a[primary].localeCompare(b[primary]);
          } else if (typeof a[primary] === 'number' &&
          typeof b[primary] === 'number') {
               comparison = a[primary] > b[primary] ? 1 : -1;
          }

          // if primary attributes are the same, sort by secondary attribute
          if (comparison === 0 && secondary) {
               if (typeof a[secondary] === 'string' &&
               typeof b[secondary] === 'string') {
                    comparison = a[secondary].localeCompare(b[secondary]);
               } else if (typeof a[secondary] === 'number' &&
               typeof b[secondary] === 'number') {
                    comparison = a[secondary] > b[secondary] ? 1 : -1;
               }
          }

          return reverse ? -comparison : comparison;
     });
     const result = mapped.map(function (el) {
          return library[el.index]
     });
     setLibrary(result);
}

