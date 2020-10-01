/* PUTTING IT ALL TOGETHER: THE BUDGET APP PROJECT:
    PROJECT PLANNING AND ARCHITECTURE: STEP 1:   */

/** THE BUDGET CONTROLLER: **/

// Function Constructor. Pass the data into it that we want them to have.
// We say: this.id should be the same as the id we pass it. Same for the description and the value.

var budgetController = (function() {
    
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    // This method is named: calcPercentage. We need to store our percentage somewhere so we do it in the Expense property above.
    Expense.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome > 0) {
        this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    // Get percentage method for this expense object/function constructore. Simple function that will retrieve the percentage from the object and return it.
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }


    // A function that receives the income or expense, then sum of the items. Using the type keyword.
    // For the income will be the above Expenses method. Private function.
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
// DATA STRUCTURE - private variable not visible. When we add something, it will NOT be accessible from the outside. All items are stored in the allItems object.
// We put methods in a prototype property of the expenses/income for the function constructors, So all objects created through them will inherit these methods.
// Its better this way so they are not attached to each individual object but instead its object will then inherit it from the prototype.
// The type is either the income or the expense.
var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(cur) {
        sum += cur.value;
    });
    // Store it into our global data structure. This should equal the sum we just calculated. Now we can use this in our calculateBudget method (further down)
    data.totals[type] = sum;
};

// Global Data Model:
var data = { // Data Object contains all our info.
    allItems: { // this allItems object is inside the data object.
        exp: [], // If user inputs an expense, then this Array will be selected.
        inc: [] // If user inputs an income, then this Array will be selected. 
    },
    totals: { // we can store our sums here 
        exp: 0,
        inc: 0
    },
    
    budget: 0,
    percentage: -1 // set this property to -1 as it don't exist at this point.
};

// Public method that will allow other modules to add a new item into our data structure.
// We return an object, which will contain all our public methods, including the: addItem method.
// This method has its own types: description, value.
return {
    addItem: function(type, des, val) {
        // add a new expense item.
        var newItem, ID;
        
        // 1. CREATE NEW ID:
        if (data.allItems[type].length > 0) {
            // As soon as we have some element, then the new ID will be defined based on this. This is the new ID for the new item:
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
        } else {
            ID = 0;
        }
        
        // 2. CREATE NEW ITEM BASED ON 'exp' or 'inc' type: 
        if (type === 'exp') {
            newItem = new Expense(ID, des, val); // Why is the instructor call 'des' designation rather than description?
        // If the input is an income, the we want to create an income object:
        } else if (type === 'inc') {
            newItem = new Income(ID, des, val);
        }
        // 3. PUSH IT INTO OUR DATA STRUCTURE:
        data.allItems[type].push(newItem);

        // Then we return that new item as then the other function, thats going to call this one, can have diret access to the item that we just created.
        // 4. RETURN THE NEW ELEMENT:
        return newItem;
    },
    // This method will be called by our Budget Controller:
    deleteItem: function(type, id) {
        // using the: map method.
        var ids, index;
        ids = data.allItems[type].map(function(current) {
           return current.id; 
        });

        // Find the index. indexOf method returns the index number of the element of the array that we input here.
        // The index variable will become 3 as the number 6 is in location 3.
        index = ids.indexOf(id);
        // Delete item 3 from the array. If the index is not -1, then we going to delete - splice (remove)
        if (index !== -1) {
            data.allItems[type].splice(index, 1);
        }
    },
    
// Public Method or a function? Parameters, arguments the App Controller have to pass into this method is: all of our exp and income objects, both are
// identified by their id. To delete a item from one of the 2 arrays is we need to know if we are talking about an expense or an income. So we need to setup the parameters here.
calculateBudget: function(type, id) {

    // Calculate total income and expenses. Calling our private function.
    calculateTotal('exp');
    calculateTotal('inc');

    // Calculate the budget: income - expenses. Use our Global Data Structure. Do the calculation on the right, store in the Data Structure (in the left) in the budget property.
    data.budget = data.totals.inc - data.totals.exp;

    // Calculate the percentage of income that we spent. We can store the % we calculate in Data Structure. The % of income that we spend is the expenses divided
    // by the incomes.
    // Example: Expense = 100 and income 300, spent 33.333% 100/300 = 0.3333 * 100.
    // With this we calculate our %.
    if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
    } else {
        data.percentage = -1; // non existance
    }
    
}, 
// Update the perentages in the Budget controller:
// Public calculate methods to calculate the expense percentage for each of the expense objects that are stored in the expenses array. 
    calculatePercentages: function() {
     // call the calculatePercentae method for each of the elements in the array in our data structure.
     // using the forEach method again. So first we need our array, we going to retrive it from our data structure. We only need our exp array.
     // Then we can call our forEach method as this is an array or callback function. Have access to current variable here.
     // For each of the elements I want to call the calcPercentage method.
     data.allItems.exp.forEach(function(cur) {
         // pass the totals in the calcPercentage method.
        cur.calcPercentage(data.totals.inc);
     });

    },
    // Loop over all of our expenses for each of our objects. (function(cur)) is a callBack function which usually returns something. We return the result of getPercentage
    // method.
    getPercentages:  function() {
        var allPerc = data.allItems.exp.map(function(cur) {
            return cur.getPercentage(); // this will get 5 times for each of the 5 elements, then sort in the: allPerc array.
        });
        // We return the allPerc variable which is an array with all the percentages.
        // At the end, we return the: allPerc array we calculate the percentage on each individual object and then we return an array with all of
        // these percentages in it.
        return allPerc;
    },


// Method named: getBudget:
getBudget: function() {
    // return the total incomes, expenses and %. Return 4 values at sametime using an Object. Return this Object for the 4 properties for the 4 values.
    return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
    };
},

// Method just to test our data structure in console. Logout our data structure to the console:
    testing: function() {
        console.log(data);
    }

};
})();

// THE UI CONTROLLER:
// Create another module with just the one that will take care of our UI. We'll call that 'UIController'.
var UIController = (function() {

// Private variable to store all the strings from the UIController.
// Data structure to make our life easier later on. A central place where all our strings are nicely stored, and we can then retrieve them & change them
// easily, if and when need to.
// Method 
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    // Private function
    var formatNumber = function(num, type) {
        var numSplit, int, dec;

        /* 
        + or - before number
        exactly 2 decimal points
        comma separating the thousands

        2310.4567 -> 2,310.46
        200 -> + 2,000.00
        */
       num = Math.abs(num); // absolute
       num = num.toFixed(2); // 2 decimal numbers rule and storing it in the num variable.
        // comma separating the thousands. Split number into decimal part and integer part using split method on the string,
        numSplit = num.split('.'); // split into two parts, the integer part and the decinmal part. Will be stored in an Array.
        // integer part of a number:
        int = numSplit[0];
        // add a comma if we are into the thousands: if more than 3 numbers then we are in the thousands. Sub string - This method will return part of a string we want.
        if (int.length > 3) {
            // This gives us the first part of the number. start at position 0 and read one element. Add the comma then take another substring.
            // we use the length property of the string to make this more dynamic rather than hardcoding it. This will work for all of the cases.
            // example, if length is 5, 5 - 3 is 2, so the comma will be here: 23,510. 
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); // input 23510, output 23,510.
        }

        // decinmal part of a number:
        dec = numSplit[1];
        // ternary operator instead of if-statement: if the type is exp then the sign will be minus. If not the sign will be a plus +
        // what is in the parenthises will get executed first.
        return (type === 'exp' ? sign = '-' : '+') + ' ' + int + '.' + dec;
    };

    // Private function called (only the Controller module can use this function): nodeListForEach function. Declaring the nodeListForEach function.
    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

// ADD THE 2 INPUTS IN getInput:
    // The controller below will call this Method and it wants to receive back all of these values.
    return {
        getInput: function() {
            return {
// 2 Combo Boxes - Add the 2 inputs that I've just created in the HTML file:
            type__inc: document.querySelector(DOMstrings.inputType).value, // We read the value of the type. Will be either inc or exp. Will passed into the add item method, we expect either inc or exp.
            type__exp: document.querySelector(DOMstrings.inputType).value, // We read the value of the type. Will be either inc or exp. Will passed into the add item method, we expect either inc or exp.
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: parseFloat(document.querySelector(DOMstrings.inputValue).value) // Use a function called parseFloat to convert a string into a decimal number. So this function will take this string here:
            };
        },

        // Add our newly created object to the user interface and this means that we're going to do some DOM manipulation. Public method this UI Controller.
        // To add this new item to the list, we need object itself - we call it obj. So we need the obj and the type (either the income or expense).
        // This obj is the object we created using our function constructor then passed to our app controller.
        addListItem: function(obj, type) {
                var html, newHtml, element;
                // Create HTML string with placeholder text. %id% will be replaced with the actual data from the object.

                if (type === 'inc') {
                    element = DOMstrings.incomeContainer;

                    html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        
                } else if (type === 'exp') {
                    element = DOMstrings.expensesContainer;

                    html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }
                

                // Replace the placeholder text with some actual data: replace method:
                // html is a string and strings have their own methods incl. replace.
                // replace searches for a string then replaces that string with the data that we put into the method.
                newHtml = html.replace('%id%', obj.id);
                newHtml = newHtml.replace('%description%', obj.description);
                // adding the result of formating this number: method on same object, so we use the: this keyword.
                newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

                // Insert the HTML into the DOM: first select an element from our webpage. Use the insert adjacent HTML method for that.
                // The element will become the income list if its the income, the expense list if it's an expense.
                // Use our AdjacentHTML method. The beforeend make sure all our HTML will be inserted as a child of these containers.
                document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        // new method to delete an item from the UI. To remove from the DOM, We need either an ID name, so we can select it and then remove it.
        deleteListItem: function(selectorID) {
            // To remove child method we need to know the parent. so we need to move up the DOM. JS we can only remove a child element.
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },



// CLEARING OUR INPUT FIELDS:
// Public method called: clearFields:
// Convert a list to an Array using the array method called 'slice' which takes a copy of the array that it's called on. Trick the method and pass
// a list into it will still return an array. We can't call Array methods here on the list. Instead we call the slice method using the call method,
// then passing the fields variable into it, so this it becomes the This Variable. The Slice method is stored in the Array prototype.
        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

// This Array is the function constructor for all Arrays. Arrays inherit from the array function constructors are in the Array's protoype property.
// Since this is a function, we can use the call method on it. Then set the This Variable to the fields. This will trick the slice method into thinking
// that we give it an array, so that it'll return an Array. Now store this into an variable called: fieldsArr, then is will be an Array. We can now
// loop over this Array and clear all the fields that were selected at once. 

            fieldsArr = Array.prototype.slice.call(fields);
// We can use the forEach method on Arrays. Pass a callback function into this method, and then this callback function is applied to each of the elements
// in the array. So we use an annonymous function in here, that can recieve upto 3 arguments. We have access to: current element (inputDescription,
// inputValue), index number(0 - the lengh of array - 1), the etire fields array). We want to clear all these fields. We set the current value to empty,
// then the those fields will be cleared. So the forEach method moves over all of the elements of the fileds array, then sets the value of all of them
// back to the empty string. We have access to the current element thanks to the callback function which has access to these 3 arguments.
// Now we can use this method in our controller.

            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
// Get the focus back to the first field - the description field, so the user can continue to input items in that field. Set the focous of the first
// element of the Array. 0 is the first element. Use the focus method.
            fieldsArr[0].focus();
        },


////////////////////////////////////////////////////* HEADER IMAGE CHANGE - QUICK WINS 01 *////////////////////////////////////////////////////////////////

// Method to display our budget in the UI. We need Object where all these data will be stored.
// if object && object.budget && object.budget.type 
        displayBudget: function(obj) {
            // Declaring local variables but not assigning them to anything.
            var type, currentImage;
// I'm setting the varable for the current class list.
            currentImage = document.getElementById('topHeaderImg').classList;
// Just testing to see what is in the classList CSS.
            console.log(currentImage);

            // Ternary Operator: this is where the headerImgClass gets set.
            // The budget logic:
            // headerImgClass is what the new class will be.
            // find and replace headerImgClass and call it newClass - refactor.
            // In css, I have 3 classes now > top, top2, top3.
            obj.budget > 0 ? (type = 'inc', headerImgClass = 'top2')
            : (type = 'exp', headerImgClass = 'top3')

            // Formating the number with decimal points, and setting to the type:
            // Using querySelector to get the right textContent to update. The formatNumber taking the arguments to do something then assigns to the textContent.
            // document.querySelector is looking for the budget__value, then the textConent gets a new value. formatNumber taking the values of the 2 arguments
            // then assigns it to the textContent.
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

// Calling Function: changeImage with argument of: headerImgClass, currentImage, so whatever this is set to, its calling that function with the budget logic:
// Rename currentImage to currentClass - use refactor:
            changeImage(headerImgClass, currentImage);
            

            // If its not -1 then we want to add the % sign. so if its 30, we want to display 30%, but if it's -1 we want to display something else.
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },
    

        // Display percentages on the UI:
        // We going to add new method in our UI Controller and it going to receive the Percentages array that we stored in our App Controller.

        // Passing the percentages variable into this displayPercentages function.
        displayPercentages: function(percentages) {
            // NodeList 
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            // NodeListForEach function should be here?

            // we call nodeListForEach function, we pass a callback function into it. This function is assigned to the above callback parameter.
            nodeListForEach(fields, function(current, index) {
                if (percentages[index] > 0) {
                // Current element use the text content property  
                current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },

        // Method called displayMonth to display the current month and year in our UI as soon as we start the App:
        displayMonth: function() {
            var now, months, month, year;
            // using the date object constructor in order to save the current date into a new variable. We have to use the new keyword. Don't pass anything into the date constructor then it will return the date of today.
            now = new Date();

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novemeber', 'December'];
            month = now.getMonth();
            // We can use methods to retrieve the current year, or the current month, or the current day, or the minuete or second in which this date object was created.
            // example, getFullYear is a method.
            year = now.getFullYear();
            // Now display on webpage. The class is called: budget__title--month. Then we can call this method in the init function as want this to happy at the start of our App.
            // In the array we use the index of: month
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },
// add the changeType method:
        changedType: function() {
            // do some style manipulations: add or remove some CSS classes. 
            // Select the 3 elements that is going to receive the focus class and the button to give it the red class. Will receive the red focus class. Constructing a string.
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);
                // will return a node list:
            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });

            // Add the red class on our button: 
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

        },

        // Get the DOM strings. Return our DOMstrings from private DOMstrings into the public. Now exposing the DOMstrings object into the public.
        getDOMstrings: function() {
            return DOMstrings;
        }
    };

})();
////////////////////////////////////////////////////* HEADER IMAGE CHANGE - QUICK WINS 01 *////////////////////////////////////////////////////////////////////////////////

// This function changes the Header image according to the positive or negative number > div.budget_value :
// Now I know the Ternary logic is working. The headerImgClass is correct as it changing the path/ header image which I've checked using the console.log() statement.
// Now Trying to set the image in the CSS class - this was very hard work!
// this function is being declared here and called by the function called: displayBudget (above).

changeImage = function changeImage(headerImgClass, currentImage) {

// Changing class by switching between classes which will re-render the whole page?
    var image = document.getElementById('topHeaderImg').classList.replace(currentImage, headerImgClass);

// Testing to see what is inside these arguments:
    console.log(image, headerImgClass, currentImage);

 };



// THE GLOBAL APP CONTROLLER:
// Last module, independant from the 'UIController' module.
var controller = (function(budgetCtrl, UICtrl) {
        // variable to get the DOM strings.
        var DOM = UICtrl.getDOMstrings();

console.log(DOM);
console.log(DOM.inputBtn);


    // A function in which all our event listeners will be placed.
    var setupEventListeners = function() {
        // pass-in the ctrlAddItem function. So when user press the button this function gets called.
        // DOM.inputBtn is our DOM Elements for our event listeners.
 // Use this for my 2 ComboBoxes Quick Win:       
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    // Not just a click event but also a key-press event for when the user use the enter key.
    
        document.addEventListener('keypress', function(event) {
            // Only want to execute some code when user hits the ENTER key, not just some random key on keyboard.
            if (event.keyCode === 13 || event.which === 13) {
                // console.log('ENTER was pressed');
                // Write a custom function rather than repeating the above code - DRY.
                // When user hits the RETURN key, it will call this function: 
                    ctrlAddItem();
            }
        });
// The function: ctrlDeleteItem will be called when user clicks somewhere on this container.
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
// Imprioving the UX of our input form. Method called: changeType, using change event called: changedType. The: UICtrl.changedType is the callback function (has a method called: changedType) we going to write into the UI.
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);

    };


// Use this for my 2 ComboBoxes Quick Win:         
// We need a function to update the Budget Controller. This whole updatBudget function is called each time the user enter a new item into the UI
    var updateBudget = function() {

        // 1. Calculate the budget in the budget controller:
        // Use our new method: calculateBudget here. This calculates the budget. Now we need a method which returns the budget
        // to us so we can store it here in a variable then pass it on to the user interface controller, which then display it
        // in the third point below:
        budgetCtrl.calculateBudget();

        // 2. return the budget:
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI. We use the UICtrl to call the displayBudget object, pass in the object called buget.
        UICtrl.displayBudget(budget);

    };

    // Updating the Percentages: everytime we add or delete an item. The % of each income that each expense represents. Creating new function so we can call it later in our ctrlDeleteItem function
    //  similar to the updateBudget function. CALL this function in our other 2 functions.
    var updatePercentages = function() {
        // 1. Calculate percentages.
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller. We store in the percentages variable.
        var percentages = budgetCtrl.getPercentages();

        // 3. Update the UI with the new percentaes. A method that will display the % on the UI.
        // console.log(percentages);
        UICtrl.displayPercentages(percentages);
    };
    


    // ctrlAddItem function. In a funtion that will be called when either of these actions happen/ when we want to add a new item.
    // Private functions as not exposed to the public. this function is like the control centre of our app (tells other modules what it should do,
    // then gets data back). Then it can then use in other things.
    var ctrlAddItem = function() {
            // Declare our variables here.
            var input, newItem;

            // 1. Get the field input data. This input variable will come from the UICtrl will contain the type: getInput. Will read data from Input field and store in the input variable.
            // The input variable has the getInput object, which we'll pass
            input = UICtrl.getInput();

            // We only want the below 2-5 steps to happen if there actually is some data that we can use. We use if statement for this.
            // The description field should be differnt from empty string (or no input data). We also want samething with numbers. There is a function that tests if a number is not a number.
            // We want it not to be NaN, so its a number. Then we pass the input.value.
            // Incase if the input value is 0, so add greater than operator.
            if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

                // 2. Add the item to the budget controller. 
                // item method accepts 3 arguments which are the type, description and value, that we get. Using the input variable and the addItem method  we create a new item
                // we store it and we rtturn it and store it in this newItem variable - our new object which we going to pass to our addListItem method.
                // if its NOT a number it will return True. If it IS a number, it will return False. But we want the opposit so we use the NOT opportator. We use the AND oporator as we want them to happen at the sametime.
                newItem = budgetCtrl.addItem(input.type, input.description, input.value);

                // 3. Add the new item to the UI:
                UICtrl.addListItem(newItem, input.type);

                // 4. Clear the fields:
                UICtrl.clearFields();

                // 5. Calculate and update budget:
                updateBudget();

                // 6. Calculate and update percentages.
                updatePercentages();

            }   

    };
    // function named: ctrlDeleteItem
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        // We are relying on the DOM structure as we Hard-coded the DOM structure. We can also hard-code the traversing of that DOM structure here as well.
        // We only want stuff to happen later if the ID is defined. event.target is the property, the element where the click happened/fired.
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        // If itemID exist it will be converted to true if this exists, if it doesn't then it will be converted to false.
        if (itemID) {
            //  the format: inc-1 // split this up: strings also have methods as JS transforms them from a primitive to an object, so we can use methods on them.
            // The split method. All items to delete our item from the UI and our data model, so the budget controller.
            splitID = itemID.split('-');
            type = splitID[0];
            // ID's are integers so no decimals. parseInt is a function. TO convert the ID which is a string into a number. Then store in ID.
            ID  = parseInt(splitID[1]);

            // 1. delete the item from the data structure. Create a function in the budget controller, for deleting from the data structure, then a method for deleting
            // the item from the UI. budgetCtrl.deleteItem(type, ID);
            budgetCtrl.deleteItem(type, ID);


            // 2. Delete the item from the UI. Call the deleteListItem element:
            UICtrl.deleteListItem(itemID);

            // 3. Update and show the new budget.
            updateBudget();

            // 4. Calculate and update percentages.
            updatePercentage();

        }
    }

    console.log(UICtrl);

// Call this 'controller' function by creating a public initialisation function, which we're going to call init.
// Since its going to be Public, we need to return it in an object. We call this object is init.
// Call our setup event listeners function, which was why we created this init function.
    return {
        init: function() {
            console.log('Application has started...');
            // This method is to call the data object constructure:
            UICtrl.displayMonth();
            // pass an object but with everything set to 0. 
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };

})(budgetController, UIController);
// When I test this from the console, I can see the object printed out.
// Our Event Listeners will only going to be setup as soon we call the init function. So we do that outside of the Controllers.
controller.init();












































































