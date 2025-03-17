const canvas_width = 500;
const canvas_height = 200;
const bottom_margin = "10px";
const left_margin = "20px";
const column_width = "120px"; //would be good to have this width relative to the longest word
const tb_offset_x = 100;
const tb_offset_y = 5;
const start = 0;
const max_paradigms = 3;
const round_edges = 5;
const tb_width = 200; 
const tb_height = 75;
const opacity = 0.7;
const line_spacing = 20;
const column_margin = 20;
const transition_speed = 550;
const slide_left = "0px";
const slide_right = "40px";
const text_padding = "5px 10px"
const round_box_corners = "5px"



window.addEventListener("load", makePhaseThree);

// What element do we want to hover over and have something happen?
// -> this is where our event code goes
// so in this case, mouseenter goes with the language name text

// when we hover:
// need to transition to bold text and yellow background
// we might want some delay/transition element here
// also, for languages that are in 'influenced by' of this group:
// those entire groups need to shift left
// for languages that are in 'influences':
// those entire groups need to shift right

//since flex boxes were used, the shift can happen by changing the left-margin of the respective rows

function makePhaseThree() {
    d3.json("languages-simpler.json").then(data => {
        data.languages.sort((a, b) => a.name.localeCompare(b.name));
            
        const container = d3.select("body") 
            .append("div") // append a div element to act like a container
            //use flex container to support table-like structure
            //make flex boxes align like a table
            //note: boxes will flex to size of viewfinder (might squish)
            .style("display", "flex") //using flex instead of absolute positioning
            .style("flex-direction", "column") //stacks elements vertically
            .style("position", "relative"); // make sure that absolute elements (in this case toggleBox) position correctly
        
        const rows = container.selectAll(".row") //selection of all containers that have attribute "row"
            .data(data.languages) // bind data to DOM
            .enter()
            .append("div") 
            .attr("class", "row") 
            .style("display", "flex")
            .style("align-items", "center") 
            .style("margin-bottom", bottom_margin) // leave space between rows
            .style("margin-left", left_margin);

        //append language name with click element
        rows.append("div")
            .text(d => d.name)
            .style("width", column_width) // Set a width so text aligns properly
            // implementing clickability
            .style("cursor", "pointer") // Indicate it's clickable
            .on("click", function(event, d) {
                // Get position of clicked element
                let rect = this.getBoundingClientRect();
                var isVisible = toggleBox.style("visibility") === "visible";
                // Position the toggle box
                toggleBox
                    .style("left", (rect.x + tb_offset_x) + "px")
                    .style("top", (rect.y + tb_offset_y) + "px") // Offset so it overlaps the second row
                    .style("visibility", isVisible ? "hidden" : "visible");

                toggleBox.selectAll("text").remove(); // remove existing text from box

                const txt = toggleBox.append("text")  // add text to toggleBox
                    .attr("x", tb_width/2) //this line keeps the text horizontally centered
                    .attr("y", line_spacing) // set text element 20 pixels below the top of the toggle box
                    .attr("text-anchor", "middle")
                    .attr("dominant-baseline", "middle")
                    .attr("fill", "white");

                // add year to togglebox text element
                txt.append("tspan")
                    .attr("x", tb_width/2) 
                    .attr("dy", start) // the first tspan starts 20 pixels below the top of the toggle box (0 pixels away from where the text element was set)
                    .text(`Year: ${d.year}`); 

                // add name to toggle box text
                txt.append("tspan")
                    .attr("x", tb_width/2) 
                    .attr("dy", line_spacing) // second tspan is 20 pixels below the first
                    .text(`Creator: ${d.creator}`);
            })
            .on('mouseenter', function (event, d){
                d3.select(this) //select hovered name
                    .transition() // using d3 transitions to add a gradual effect
                    .duration(transition_speed)
                    .style("background-color", "yellow")
                    .style("padding", text_padding) // padding inside the box
                    .style("border-radius", round_box_corners) // rounded corners
                    .style("font-weight", "bold");

                const influBy = d.influenced_by;
                const influ = d.influences;

                // .each: for each row, check if it's in influences or influenced_by
                // of the language that is currently being hovered over
                d3.selectAll(".row").each(function (data){
                    // check if current row is not the hovered-over row
                    // and that influenced_by is not empty
                    if (data !== d && influBy) {

                        // check if in the influenced_by list of the hovered row
                        if (influBy.includes(data.name)){
                            d3.select(this)
                                .transition() // using d3 transitions to add a gradual effect
                                .duration(transition_speed)
                                .style("margin-left", slide_left); // move 20 pixels left
                        
                        // otherwise check if the language name is in influences
                        } else if (influ.includes(data.name)) {
                            d3.select(this)
                                .transition() // using d3 transitions to add a gradual effect
                                .duration(transition_speed)
                                .style("margin-left", slide_right); // move 20 pixels right
                        }
                    } 
                });
                
            })
            .on('mouseleave', function (event, d){
                // change back to normal font and no background
                d3.select(this)
                    .transition()
                    .duration(transition_speed)
                    .style("background-color", "transparent")
                    .style("font-weight", "normal");

                //shift margin back
                d3.selectAll(".row")
                    .transition() // using d3 transitions to add a gradual effect
                    .duration(transition_speed)
                    .style("margin-left", left_margin)

            });
        
        rows.each(function(d){
            const row = d3.select(this); //select current row
            const display_paradigms = d.paradigm.slice(start, max_paradigms); //start = 0, take at most 3 paradigms

            display_paradigms.forEach(paradigm => { // go through all paradigms in the slice
                row.append("div")
                    .text(paradigm)
                    .style("width", column_width)
                    .style("background-color", "#4178fa") // box color
                    .style("color", "white") // text color
                    .style("padding", text_padding) // padding inside the box
                    .style("border-radius", round_box_corners) // rounded corners
                    .style("text-align", "center") // center the text
                    .style("margin-left", left_margin); // keep a space between paradigms
            });
        });
        
        // creating an intially invisible box for the year and creator to go in
        // when a programming language is clicked, the box will become visible
        //append svg inside each row so that each name has its own toggle box
        const toggleBox = d3.select("body").append("svg")
            .attr("width", canvas_width)
            .attr("height", canvas_height)
            .style("position", "absolute")
            .style("visibility", "hidden");
        
        // append a semi-transparent box
        toggleBox.append("rect")
            .attr("x", start) // start = 0
            .attr("y", start)
            .attr("rx", round_edges)
            .attr("ry",  round_edges)
            .attr("width", tb_width)
            .attr("height", tb_height)
            .attr("fill", "black")
            .attr("stroke", "black")
            .style("opacity", opacity);

        
    });
}