export default async function celebAnagramFinder(value) {
  function cleanInputValue(value) {
    //write input value to anagram variable
    //Check if there are multiple ANAGRAMS and split into array
    if (value.toUpperCase().includes(",")) {
      //Create array from comma seperated anagram and remove spaces
      value = value
        .toUpperCase()
        .replace(/\s/g, "")
        .split(",");
      //Remove any non alphabet values
      value.forEach(function(val, index) {
        value[index] = val.replace(/[^A-Z]/g, "");
      });
      // console.log(anagram)
    } else {
      //If there is only one ANAGRAM value
      //Place Anagram into Array
      value = [value.toUpperCase().replace(/\s/g, "")];
      //Remove any non alphabet values
      value.forEach(function(val, index) {
        value[index] = val.replace(/[^A-Z]/g, "");
      });
    }

    return value;
  }

  let anagram = cleanInputValue(value);

  //console.log(anagram)

  //Bypass CORS if needed. Replace fetch url with proxyUrl + targetUrl
  let proxyUrl = "https://cors-anywhere.herokuapp.com/";
  let targetUrl = "https://celebritybucks.com/developers/export/JSON";

  let matchRateResult = {};

  //Fetch the json of celebs
  let resFetch = await fetch(proxyUrl + targetUrl);

  let celebsFromApi = await resFetch.json();

  //covnert result to JSOn

  function apiChange() {
    //If it fails, log message and quit
    if (resFetch.status !== 200) {
      console.log(
        "Looks like there was a problem. Status Code: " + resFetch.status
      );
      return;
    }
    // STRUCTURE---- celebsFromApi = {CelebrityValues: [{ name: "Serena Williams" },{ name: "Kacey Musgraves" }, { name: "Ivana Milicevic" } ] };
    // console.log("Celebs from API", celebsFromApi.CelebrityValues)

    //Example Anagrams to search for
    /* var anagram = ["TRUMCDONALD", "SHAVERSINB", "SHAVERSINC", "SHAVERSINM", "SHAVERSINP", "HASTYMAREA", "HASTYMAREE", "HASTYMAREI",
           "HASTYMAREL", "HASTYMAREN", "HASTYMAREO", "HASTYMARER", "HASTYMARES", "HASTYMARET", "HASTYMAREU", "SLIMSWINEAREAA",
           "SLIMSWINEAREAE", "SLIMSWINEAREAI", "SLIMSWINEAREAL", "SLIMSWINEAREAN", "SLIMSWINEAREAO", "SLIMSWINEAREAR", "SLIMSWINEAREAS",
           "SLIMSWINEAREAT", "SLIMSWINEAREAU", "ROTTENGROANA", "ROTTENGROANE", "ROTTENGROANI", "ROTTENGROANL", "ROTTENGROANN", "ROTTENGROANO",
           "ROTTENGROANR", "ROTTENGROANS", "ROTTENGROANT", "ROTTENGROANU", "GRIMERTABOOB", "GRIMERTABOOC", "GRIMERTABOOM", "GRIMERTABOOP", "PUTINKARMAF",
           "PUTINKARMAH", "PUTINKARMAV", "PUTINKARMAW", "PUTINKARMAY", "SLOTHMENWAILA", "SLOTHMENWAILE", "SLOTHMENWAILI", "SLOTHMENWAILL", "SLOTHMENWAILN",
           "SLOTHMENWAILO", "SLOTHMENWAILR", "SLOTHMENWAILS", "SLOTHMENWAILT", "SLOTHMENWAILU", "BENLAIDLAWB", "BENLAIDLAWC", "BENLAIDLAWM", "BENLAIDLAWP",
           "ONEMUTTISLANDA", "ONEMUTTISLANDE", "ONEMUTTISLANDI", "ONEMUTTISLANDL", "ONEMUTTISLANDN", "ONEMUTTISLANDO", "ONEMUTTISLANDR", "ONEMUTTISLANDS",
           "ONEMUTTISLANDT", "ONEMUTTISLANDU", "JEDIMATHSA", "JEDIMATHSE", "JEDIMATHSI", "JEDIMATHSL", "JEDIMATHSN", "JEDIMATHSO", "JEDIMATHSR", "JEDIMATHSS",
           "JEDIMATHST", "JEDIMATHSU"];
  */
    //Go through the anagram array
    for (let k_counter = 0; k_counter < anagram.length; k_counter++) {
      //Split the anagram into an array of individual letters
      let splitAnagramToLetters = anagram[k_counter].split("");
      //console.log(splitAnagramToLetters)
      //[S,H,A,V,E,R,S,I,N]

      //Count the occurances of letters within the current anagram
      let anagramLetterCount = {};
      //make an array of each letter and iterate through
      splitAnagramToLetters.forEach(function(ana, ind, initialArray) {
        //Create an object that uses the letter as a key
        //Then with a filter, it iterates through the array containing all the ANAGRAM letters to compare the key letter
        //Then uses the length of the filtered result as the amount of occurances
        anagramLetterCount[ana] = initialArray.filter(function(filteredAna) {
          return filteredAna === ana;
        }).length;
      });

      //Iterate that against a loop going through the resulting array of celebs -
      //For each resulting celeb, check the matching letters
      for (
        let i_counter = 0;
        i_counter < celebsFromApi.CelebrityValues.length;
        i_counter++
      ) {
        let celebNameCleanedUp = celebsFromApi.CelebrityValues[i_counter].name
          .toUpperCase()
          .replace(" ", "")
          .replace(/[^A-Z]/g, "");
        //If the length of the word in the anagram array is the same as the name from the api call (with spaces removed)
        if (anagram[k_counter].length === celebNameCleanedUp.length) {
          //Make an empty object
          let matchedLetters = {};

          //Iterate through the splitAnagramToLetters array and count letter matches with celeb name
          for (
            let l_counter = 0;
            l_counter < splitAnagramToLetters.length;
            l_counter++
          ) {
            //If the name from the celebs api array contains the letter from the splitAnagramToLetters array
            if (celebNameCleanedUp.includes(splitAnagramToLetters[l_counter])) {
              //If the ind object does not contain the current letter from the splitAnagramToLetters array (because that letter has not been checked yet)
              if (!matchedLetters[splitAnagramToLetters[l_counter]]) {
                //Find the amount of times the current letter from the splitAnagramToLetters array shows up in the celebsFromApi name
                let anagramLetterInCelebLetterCount = celebNameCleanedUp
                  .split("")
                  .filter(data => data === splitAnagramToLetters[l_counter])
                  .length;

                // let lettersInAnagramCount = splitAnagramToLetters.filter((data) => data === splitAnagramToLetters[l_counter]).length;
                //If the amount of times this letter is found is larger than the amount of times it's in the anagram, then we need to break and leave the loop and move on to the next anagram

                if (
                  anagramLetterInCelebLetterCount >
                  anagramLetterCount[splitAnagramToLetters[l_counter]] + 1
                ) {
                  //debugger;
                  break;
                } else {
                  matchedLetters[
                    splitAnagramToLetters[l_counter]
                  ] = anagramLetterInCelebLetterCount;
                  //{A:1,B:3}
                }
                //Add the splitAnagramToLetters letter into the ind object along with the amount of times the current showed up
              }
            }
          }

          //Compare the 2 objects and count the amount of matches
          //console.log(anagramLetterCount, ind)
          let count = 0;
          let totalCount = 0;
          //Iterate through the keys of the anagramLetterCount object which keeps a record of the occurance of letters in the celeb name
          //The count variable keeps a count of the matches
          Object.keys(anagramLetterCount).forEach(function(indVal) {
            if (matchedLetters[indVal] === anagramLetterCount[indVal]) {
              //console.log(indVal, ind[indVal],anagramLetterCount[indVal] )
              count++;
            }
          });

          //totalCount gets the total count of matches then converts this into a percentage value based on the amount of matches
          totalCount = (
            (count / Object.keys(anagramLetterCount).length) *
            100
          ).toFixed();

          //Control the threshold for what is shown in the results
          if (totalCount >= 80) {
            if (!matchRateResult[anagram[k_counter]]) {
              //Create an empty array is it doesn't
              matchRateResult[anagram[k_counter]] = [];
            }
            //Push the resulting Celeb and match rate to the obj object
            //obj.*anagramName* = [{Celeb Name: 90%},{Other Celeb Name: 90%}]
            matchRateResult[anagram[k_counter]].push({
              [celebsFromApi.CelebrityValues[i_counter].name]: totalCount + "%"
            });
          }
        }
      }
    }

    //{THANKSMO:[{Tom Hanks: "100%"}],TRUMCDONALD:[{Donald Trump:"100%"}]}
    console.log(matchRateResult);

    return new Promise(function(resolve, reject) {
      resolve(matchRateResult);
      //throw new Error("Something went badly wrong!");
    });
  }

  return await apiChange();
  // return  matchRateResult;
}
