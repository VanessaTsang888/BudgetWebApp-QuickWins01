# The Budget Web App - Quick Wins
This budget app allows us to add incomes and expenses for a certain month. The app calculates how much money we've made and how much we've spent. Then it gives us a nice budget at the top of this app, which will either be a positive or negative number.

During The Complete JavaScript 2020 Course, I used JavaScript ES5 to develop this Budget web app, following a long with the instructor "Jonas Schmedtmann".

## Project Goals
This Budget web app uses advanced concepts including objects and functions, lots of arrays, lots of DOM manipulation to develop a web app that allows the users to keep on top of their monthly budget.

I have now completed my first Quick Wins on this training course and the name of it is: Header Image Change. This image will change according to the state of the budget_value. For example, if the value is postitive number, the image will dynamically change to the positive image, if the value changes to a negative number, the image will dynamically change to the negative image.

### The Scope
This Budget web app have been created from following the lectures within Section 6 of The Complete JavaScript 2020 Course. I also used the Architecture diagram provided to help me develop this app.
Whilst developing this app, I had tested my code from the frontend using: console.log() This also help whilst debugging my app. Debugging my own code has been great for my learning.

### How The App Works
There are 3 modules, the Budget Controller, the App Controller, and the UI Controller. In each one of them, we can see the functions or methods. We have functions calling other functions.
The user inputs data into the app, which is then stored in a data structure and displayed on a the user interface (UI), and the budget calculation will update, when user clicks on the green tick button or use their Enter key on their keyboard.
There is a functionality that allows the user to delete an item from the list with from the Income or Expenses column.

• The user actions are handled by event handlers;
• We get  user's data out of the input fields, and print that to the UI;
• Then the new item gets added to the data structure, and to the UI;
• Then the budget gets updated;
• Then internally calculate the new budget, and update the UI.
