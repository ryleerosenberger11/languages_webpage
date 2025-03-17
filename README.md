Rylee Rosenberger

This program works with d3.js to create a dynamic, interactive visualization of data from a .json file.
The .json file contains a dictionary of languages, each with a name, year, creator, list of paradigms,
a list of languages that the language itself influences, and a list of languages it is influenced by.

For the web page display:
There is one row for each language.
The first column is the language name, and the following columns are the first of AT MOST 3 of that
language's paradigms.
Hovering over a language name will highlight that name, and:
shift languages that it influences to the right, and
shift languages that it is influenced by to the left.
Clicking on a language name will display its year and creator.
Clicking again will hide the year and creator.
