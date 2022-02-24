//This file contains all the info for the different combinatorial games I know about.
//Skip to something alphabetically by searching for "<X>"

var THIS_SITE = "http://turing.plymouth.edu/~kgb1013/rulesetTable.php";


//TODO: I should do this for more paper citations.  That way if I need to change it, it will work for them all.
GONC5 = "http://library.msri.org/books/Book70/contents.html";

BURKE_GEORGE_2019 = GONC5;
BURKE_HEARN_2018 = "https://doi.org/10.1007/s00182-018-0628-8";
DUCHENE_RENAULT_2014 = "https://doi.org/10.1016/j.tcs.2013.11.025"; //Vertex Nim played on graphs
FUKUYAMA_2003 = "https://doi.org/10.1016/S0304-3975(03)00292-5"; //A Nim game played on graphs
RENAULT_SCHMIDT_2015 = "https://hal.archives-ouvertes.fr/hal-01151950/document";
STOCKMAN_2004 = "http://www.aladdin.cs.cmu.edu/reu/mini_probes/papers/final_stockman.ppt"; // The game of nim on graphs:  NimG  (presentation)

function unpublished(text) {
    var element = document.createElement("span");
    element.appendChild(toNode(text));
    element.innerHTML += "&#8224";
    return element;
}

var RulesetProperties = Class.create({

    /**
     * Initialize a Ruleset
     * title: the name of this
     */
    initialize: function(title, informationURL, isImpartial, lengthNode, initialPositionOutcomeClasses, complexity, otherProperties) {
        this.title = title;
        if (informationURL == null) {
            //no link for this game
            this.informationLink = toNode(this.title);
        } else {
            this.informationLink = document.createElement("a");
            this.informationLink.href = informationURL;
            this.informationLink.appendChild(toNode(title));
        }
        this.informationLink.style.fontSize = "large";
        this.isImpartial = isImpartial;
        this.lengthNode = toNode(lengthNode);
        this.initialPositionOutcomeClassesNode = toNode(initialPositionOutcomeClasses);
        this.complexityNode = toNode(complexity);
        this.otherPropertiesNode = toNode(otherProperties);
        this.variants = new Array();
        this.playableLinks = new Array();
        this.blogLink = toNode("");
        this.imageNode = toNode(" ");
        this.aliases = [];
        this.briefDescription = "";
    }
    
    /**
     * Adds an alias to this.
     */
    ,addAlias: function(aliasName) {
        this.aliases.push(aliasName);
    }
    
    /**
     * Adds a tooltip to the cell for this.
     */
    ,addBriefDescription(description) {
        this.briefDescription = description;
    }
    
    /**
     * Adds an image to this.
     */
    ,setImage: function(imageLocation) {
        var image = document.createElement("img");
        image.src = imageLocation;
        image.title = "Know of a better image for " + this.title + "?  Please let Kyle know!";
        image.style.maxWidth = "100px";
        this.imageNode = document.createElement("div");
        this.imageNode.appendChild(document.createElement("a"));
        this.imageNode.lastChild.href = imageLocation;
        this.imageNode.lastChild.appendChild(image);
        this.imageNode.style.textAlign = "center";
    },
    
    /**
     * Adds a link to a playable version of this.
     */
    addPlayableLink: function(linkURL, languageName) {
        var link = createTextLink(languageName, linkURL);
        this.playableLinks.push(link);
    },
    
    /**
     * Adds a link to the blog post.
     */
    addBlogLink: function(linkURL) {
        this.blogLink = document.createElement("div");
        this.blogLink.style.fontSize = "small";
        this.blogLink.appendChild(document.createTextNode(" ("));
        this.blogLink.appendChild(createTextLink("blog post", linkURL));
        this.blogLink.appendChild(document.createTextNode(")"));
    },
    
    /**
     * Creates a Node describing whether this is impartial.
     */
    createPartialityNode: function() {
        if (this.isImpartial) {
            return document.createTextNode("Impartial");
        } else {
            return document.createTextNode("Strictly partisan");
        }
    },
    
    /**
     * Creates and gets a div with the playable web versions.
     */
    getPlayableLinksDiv: function() {
        var div = document.createElement("div");
        div.style.fontSize = "small";
        if (this.playableLinks.length == 0) {
            return div;
        }
        div.appendChild(document.createTextNode(" Play it: "));
        for (var i = 0; i < this.playableLinks.length; i++) {
            div.appendChild(this.playableLinks[i]);
            if (this.playableLinks.length > i+1) {
                div.appendChild(document.createTextNode(", "));
            } 
        }
        div.appendChild(document.createElement("br"));
        return div
    }
    
    /**
     * Gets an element for the aliases.  Element is non-empty only if there are aliases for this game.
     */
    ,getAliasElement: function() {
        var aliasElement = document.createDocumentFragment();
        if (this.aliases.length > 0) {
            var akaString = "AKA: ";
            for (var i = 0; i < this.aliases.length; i++) {
                akaString += this.aliases[i];
                if (i < this.aliases.length - 1) {
                    akaString += ", ";
                }
            }
            var akaSpan = document.createElement("span");
            akaSpan.appendChild(toNode(akaString));
            akaSpan.style.fontSize = "small";
            appendChildrenTo(aliasElement, [document.createElement("br"), akaSpan]);
        }
        return aliasElement;
    }
    
    /**
     * Creates a table row for this rule set.
     */
    ,getTableRow: function(isVariant) {
        var row = document.createElement("tr");
        
        //anchor to this row
        var pageURL = HOME + "rulesetTable.php";
        //var anchor = document.createElement("a");
        //anchor.href = anchorURL;
        row.id = this.title; //leave this unencoded because the encoded characters don't work as the actual id.  (The browser translates it.)
        var encodedTitle = encodeURI(this.title);
        
        var rowLinkP = document.createElement("p");
        appendChildrenTo(rowLinkP, ["-- ", createTextLink("link here", pageURL + "#" + encodedTitle), " --"]);
        rowLinkP.style.fontSize = "x-small";
        //rowLinkP.style.textAlign = "center";
        
        //cell with the name of the ruleset
        var nameCell = document.createElement("td");
        row.appendChild(nameCell);
        appendChildrenTo(nameCell, [this.informationLink, this.getPlayableLinksDiv(), this.blogLink, this.getAliasElement(), rowLinkP]);
        if (this.briefDescription.length > 0) {
            nameCell.title = this.briefDescription;
        }
        
        //add row space for variants
        if (!isVariant) {
            row.firstChild.rowSpan = this.variants.length + 1;
            row.appendChild(document.createElement("td"));
            row.lastChild.appendChild(this.imageNode);
        }
        //Is it impartial?
        row.appendChild(document.createElement("td"));
        row.lastChild.appendChild(this.createPartialityNode());
        //is it short?
        row.appendChild(document.createElement("td"));
        /*var lengthString = "Loopy";
        if (this.isShort) {
            lengthString = "Short";
        }*/
        row.lastChild.appendChild(this.lengthNode);
        //Initial position outcome class
        row.appendChild(document.createElement("td"));
        row.lastChild.appendChild(this.initialPositionOutcomeClassesNode);
        //Computational Complexity
        row.appendChild(document.createElement("td"));
        row.lastChild.appendChild(this.complexityNode);
        //Other (misc) properties
        row.appendChild(document.createElement("td"));
        row.lastChild.appendChild(this.otherPropertiesNode);
        
        return row;
    },
    
    /**
     * Adds rows to the table for this rule set and its variants.
     */
    addRowsToTable: function(table) {
        table.appendChild(this.getTableRow(false));
        for (var i = 0; i < this.variants.length; i++) {
            table.appendChild(this.variants[i].getTableRow(true));
        }
    },
    
    /**
     * Adds a variant to this.
     */
    addVariant: function(variantRuleset) {
        this.variants.push(variantRuleset);
    }
    
}); //end of RulesetProperties class
    
/**
 * Statically creates a Node describing whether this is a short game.
 */
RulesetProperties.createLengthNode = function(isShort) {
    if (isShort) {
        return document.createTextNode("Short");
    } else {
        return document.createTextNode("Loopy");
    }
};

var rulesetPropertiesList = new Array();

//Now on to the rulesets!

/////////////
// <A>
 
////////////////////
//Arimaa
var rulesetName = "Arimaa";
var rulesetInfoHref = "https://en.wikipedia.org/wiki/Arimaa";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(false);
var winnerFromStart = document.createTextNode("?");
var computationalComplexity = document.createTextNode("In EXPTIME");
var otherProperties = document.createTextNode(" ");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addBriefDescription("Chess-like game with animals and pitfalls."); //TODO

properties.setImage("http://arimaa.com/arimaa/store/images/set/arimaa_side.jpg"); //fill in

//properties.addAlias(""); //if applicable

//properties.addPlayableLink("http://www.fwend.com/gameofcol.htm", "Java");

//properties.addBlogLink("http://combinatorialgametheory.blogspot.com/2010/02/game-description-...html");

rulesetPropertiesList.push(properties);

/////////////////////////////////////////////////////////
//Amazons
var computationalComplexity = document.createElement("span");
appendChildrenTo(computationalComplexity, [createTextLink("PSPACE-complete", "http://library.msri.org/books/Book56/contents.html"), toNode(" even with "), createTextLink("only one amazon apiece", "http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.103.3374")]);
var properties = new RulesetProperties("Amazons", "http://en.wikipedia.org/wiki/Game_of_the_Amazons", false, RulesetProperties.createLengthNode(true), document.createTextNode("?  (I don't know what is considered an Initial Position.)"), computationalComplexity, document.createTextNode(" "));

properties.addBriefDescription("Queens move around and shoot out spaces.");

properties.addBlogLink("http://combinatorialgametheory.blogspot.com/2009/12/game-description-amazons.html");

properties.setImage("http://webdocs.cs.ualberta.ca/~games/gifs/amsicon.gif");

rulesetPropertiesList.push(properties);

/////////////////////////////////////////////////
//Atropos
var properties = new RulesetProperties("Atropos", "combGames/atropos.html", true, RulesetProperties.createLengthNode(true), document.createTextNode("Open!  Conjecture: N (\"fuzzy\") iff there are an even number of open circles."), createTextLink("PSPACE-complete", "http://link.springer.com/chapter/10.1007%2F978-3-540-77105-0_49"), document.createTextNode(" "));

properties.addBriefDescription("Position: triangular array of circles with border pre-colored and last-played circle.  Move: color one uncolored circle any of the three colors.  If there are circles adjacent to the last one, must choose one of them.  Otherwise, play anywhere.");

properties.setImage(getPublicFileLink("images/atroposSmallExamplePic.png"));

properties.addPlayableLink(getPublicFileLink("combGames/atropos.html"), "HTML");

//Atropos variant: Unrestricted Atropos
var variant = new RulesetProperties("Unrestricted Atropos", "http://www4.wittenberg.edu/academics/mathcomp/kburke/atropos/", true, RulesetProperties.createLengthNode(true), document.createTextNode("Open!  Conjecture: N (\"fuzzy\") iff there are an even number of open circles."), document.createTextNode("Open; in PSPACE"), document.createTextNode(" "));

variant.addBriefDescription("Just like Atropos, except you can color anywhere you want on your turn.");

properties.addVariant(variant);

rulesetPropertiesList.push(properties);


/////////////
// <B>


/////////////
// <C>

/////////////////////////////////////////////////
//Chess
var properties = new RulesetProperties("Chess", "http://en.wikipedia.org/wiki/Chess", false, RulesetProperties.createLengthNode(false), document.createTextNode("Open"), createTextLink("EXPTIME-complete", "http://www.sciencedirect.com/science/article/pii/0097316581900169"), document.createTextNode(" "));

properties.addBriefDescription("Each piece moves a different way and can capture opposing pieces.  Win by trapping the opposing King."); 

properties.setImage("http://iphonewallpapers-hd.com/walls/hd_chess_game_31-other.jpg");

rulesetPropertiesList.push(properties);

///////////////////////////////////////////////////
//Chomp
var properties = new RulesetProperties("Chomp", "http://en.wikipedia.org/wiki/Chomp", true, RulesetProperties.createLengthNode(true), createTextLink("First Player", "http://en.wikipedia.org/wiki/Chomp#Who_wins.3F"), document.createTextNode("In PSPACE"), document.createTextNode(" "));

properties.addBriefDescription("Impartial: choose a cookie/chocolate square on your turn and eat it as well as all the treats above and to the right.  You lose if you eat the poison cookie in the bottom left side."); 

properties.setImage("http://cp4space.files.wordpress.com/2012/12/chocolate2.png");

properties.addPlayableLink("http://lpcs.math.msu.su/~pentus/abacus.htm", "Java");

rulesetPropertiesList.push(properties);

//////////////////////////////////////////////////////////
//Clobber  
var complexityDiv = document.createElement("div");
complexityDiv.appendChild(createTextLink("NP-hard", "http://www.emis.de/journals/INTEGERS/papers/a1int2003/a1int2003.pdf"));
complexityDiv.appendChild(document.createElement("br"));
complexityDiv.appendChild(document.createTextNode("In PSPACE"));
var properties = new RulesetProperties("Clobber", "http://www.iggamecenter.com/info/en/clobber.html", false, RulesetProperties.createLengthNode(true), document.createTextNode("?"), complexityDiv, document.createTextNode("All-Small"));

properties.addBriefDescription("Each turn, you choose a piece adjacent to an opposing piece and \"clobber\" that piece by moving there and capturing it."); 

properties.setImage("https://project.dke.maastrichtuniversity.nl/games/images/games_clobber.gif");

properties.addPlayableLink(getPublicFileLink("combGames/clobber.html"), "HTML");

properties.addPlayableLink("http://www.gottfriedville.net/games/clobber/", "Java");

//Self-Clobber or Suicide-Clobber or whatever name we wind up choosing
//TODO: change name and everything here
var variant = new RulesetProperties("Anti-Clobber", "http://combinatorialgametheory.blogspot.com/2010/09/game-description-martian-chess.html", false, RulesetProperties.createLengthNode(true), document.createTextNode("?"), document.createTextNode("In PSPACE"), document.createTextNode("All-Small"));

variant.addBriefDescription("Instead of clobbering the opposing piece, you remove your piece instead.");

properties.addVariant(variant);

//TODO: add another variant: Anti-Clobber (as given in CGSuite)

rulesetPropertiesList.push(properties);

//////////////////////////////////////////////////////////
//Clobbineering
var properties = new RulesetProperties("Clobbineering", "http://combinatorialgametheory.blogspot.com/2012/02/game-description-clobbineering.html", false, RulesetProperties.createLengthNode(true), document.createTextNode("?"), "?", "?");

//properties.setImage("https://project.dke.maastrichtuniversity.nl/games/images/games_clobber.gif");

properties.addPlayableLink(getPublicFileLink("combGames/clobbineering.html"), "HTML");

properties.addBriefDescription("Each turn, either make a Clobber move or a Domineering move on two empty spaces."); 

properties.addBlogLink("http://combinatorialgametheory.blogspot.com/2012/02/game-description-clobbineering.html");

rulesetPropertiesList.push(properties);


///////////////////////////////////////////////////////////////////////////////
//Col
var rulesetName = "Col";
var rulesetInfoHref = "https://en.wikipedia.org/wiki/Col_%28game%29";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("No common initial position.");
var computationalComplexity = createElementWithChildren("span", ["PSPACE-complete on both ", createLink("uncolored non-planar graphs", "https://eccc.weizmann.ac.il/report/2015/021/"), " and ", createLink("partially-colored planar graphs", BURKE_HEARN_2018)]);
var otherProperties = createLink("Each value is a number or a number plus *", "https://en.wikipedia.org/wiki/Winning_Ways_for_your_Mathematical_Plays");

var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addBriefDescription("Partisan graph coloring game.  Alternate painting your color, but not adjacent to yourself.");

properties.setImage("http://upload.wikimedia.org/wikipedia/commons/b/bc/ColAndSnortGraph_C_end.png");

properties.addPlayableLink("http://www.fwend.com/gameofcol.htm", "Java");

rulesetPropertiesList.push(properties);



//Col variant: Proper-k-Coloring
var rulesetName = "Proper-k-Coloring";
var rulesetInfoHref = "http://www.sciencedirect.com/science/article/pii/S0304397513001783";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("No common initial position.");
var computationalComplexity = document.createElement("span");
appendChildrenTo(computationalComplexity, [createTextLink("PSPACE-complete", "http://www.sciencedirect.com/science/article/pii/S0304397513001783")]);
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addBriefDescription("Impartial graph coloring game with k colors.");

properties.addVariant(variant);

//Col variant: Oriented-k-Coloring
var rulesetName = "Oriented-k-Coloring";
var rulesetInfoHref = "http://www.sciencedirect.com/science/article/pii/S0304397513001783";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("No common initial position.");
var computationalComplexity = document.createElement("span");
appendChildrenTo(computationalComplexity, [createTextLink("PSPACE-complete", "http://www.sciencedirect.com/science/article/pii/S0304397513001783")]);
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addVariant(variant);

//Col variant 
var rulesetName = "Oriented-Blue-Red-Coloring";
var rulesetInfoHref = "http://www.sciencedirect.com/science/article/pii/S0304397513001783";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("No common initial position.");
var computationalComplexity = document.createElement("span");
appendChildrenTo(computationalComplexity, [createTextLink("PSPACE-complete", "http://www.sciencedirect.com/science/article/pii/S0304397513001783")]);
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addVariant(variant);

//Col variant 
var rulesetName = "Weak-2-Coloring";
var rulesetInfoHref = "http://www.sciencedirect.com/science/article/pii/S0304397513001783";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("No common initial position.");
var computationalComplexity = document.createElement("span");
appendChildrenTo(computationalComplexity, [toNode("open")]);
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addVariant(variant);

//Col variant 
var rulesetName = "Distance-Coloring";
var rulesetInfoHref = "http://www.sciencedirect.com/science/article/pii/S0304397513001783";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("No common initial position.");
var computationalComplexity = document.createElement("span");
appendChildrenTo(computationalComplexity, [createTextLink("PSPACE-complete for distance 2", "http://www.sciencedirect.com/science/article/pii/S0304397513001783"), toNode(", open for higher distance")]);
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addVariant(variant);

//Col variant 
var rulesetName = "Sequential/Online Coloring";
var rulesetInfoHref = "http://www.sciencedirect.com/science/article/pii/S0304397513001783";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("No common initial position.");
var computationalComplexity = document.createElement("span");
appendChildrenTo(computationalComplexity, [createTextLink("PSPACE-complete for 3+ colors", "http://www.sciencedirect.com/science/article/pii/S0304397513001783"), toNode(", open for 2 colors")]);
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addVariant(variant);


////////////////////////////////////////////////////////////////
//Collatz Game
var properties = new RulesetProperties("Collatz Game", null, true, createTextLink("Unknown", "https://en.wikipedia.org/wiki/Collatz_conjecture"), document.createTextNode("?"), "?", document.createTextNode(" "));

properties.addBlogLink("http://combinatorialgametheory.blogspot.com/2010/08/game-description-collatz-game.html");

rulesetPropertiesList.push(properties);


///////////////////////////////////////////////////////////
//Connect Four
var properties = new RulesetProperties("Connect Four", "https://secure.wikimedia.org/wikipedia/en/wiki/Connect_Four", false, RulesetProperties.createLengthNode(true), createTextLink("First Player", "http://fabpedigree.com/james/connect4.htm"), document.createTextNode("In PSPACE"), document.createTextNode("Not strictly combinatorial"));

properties.setImage("http://www.memory-improvement-tips.com/images/260xNxfree-connect-four.jpg.pagespeed.ic.R8AnB3RcYg.jpg");

rulesetPropertiesList.push(properties);
 
///////////////////////////////////////////////////////////
//Constraint Logic
var rulesetName = "Constraint Logic (Bounded)";
var rulesetInfoHref = "http://erikdemaine.org/papers/GPC/";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("?");
var computationalComplexity = createTextLink("PSPACE-complete, even for planar graphs with five specific vertex types", "http://erikdemaine.org/papers/GPC/");
var otherProperties = document.createTextNode(" ");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addBlogLink("http://combinatorialgametheory.blogspot.com/2009/09/constraint-logic-modelling-all.html");

rulesetPropertiesList.push(properties);

//CL variant: Unbounded CL
var rulesetName = "Unbounded Constraint Logic";
var rulesetInfoHref = "http://erikdemaine.org/papers/GPC/";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(false);
var winnerFromStart = document.createTextNode("?");
var computationalComplexity = createTextLink("EXPTIME-complete even for planar graphs with six specific vertex types", "http://erikdemaine.org/papers/GPC/");
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addBlogLink("http://combinatorialgametheory.blogspot.com/2009/09/constraint-logic-modelling-all.html");

properties.addVariant(variant);


/////////////////////////////////////////////////////////
//Cookie Cutter
var properties = new RulesetProperties("Cookie Cutter", null, true, RulesetProperties.createLengthNode(true), document.createTextNode("?"), document.createTextNode("In PSPACE"), document.createTextNode(" "));

properties.addBlogLink("http://combinatorialgametheory.blogspot.com/2009/12/game-description-cookie-cutter.html");

rulesetPropertiesList.push(properties);
 
///////////////////////////////////////////////////////////
//Cutthroat
var rulesetName = "Cutthroat";
var rulesetInfoHref = null;
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("No standard Starting configuration");
var computationalComplexity = " ";
var otherProperties = document.createTextNode(" ");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addBriefDescription("Position: Graph colored Red and Blue.  Each turn, a player chooses one of their-colored vertices and removes it from the graph.  Then, they also remove any connected components that contain only vertices of one color.");

properties.addBlogLink("http://combinatorialgametheory.blogspot.com/2017/06/game-description-cutthroat-and.html");

rulesetPropertiesList.push(properties);


/////////////
// <D>


////////////////////////////////////////////////////////
//Domineering
var properties = new RulesetProperties("Domineering", "http://en.wikipedia.org/wiki/Domineering", false, RulesetProperties.createLengthNode(true), createTextLink("Varies", "http://webdocs.cs.ualberta.ca/~games/domineering/updated.html"), document.createTextNode("In PSPACE"), document.createTextNode(" "));

properties.setImage("http://webdocs.cs.ualberta.ca/~games/domineering/b1.gif");

properties.addBriefDescription("Turn: add a domino to two adjacent checkerboard squares.  Left plays vertical dominoes, Right horizontal.");

properties.addBlogLink("http://combinatorialgametheory.blogspot.com/2010/02/game-description-domineering.html");

properties.addPlayableLink(getPublicFileLink("combGames/domineering.html"), "HTML");

properties.addAlias("Crosscram"); //mentioned in Winning Ways (first page of chapter 5)


 
//Cram
var rulesetName = "Cram";
var rulesetInfoHref = "http://en.wikipedia.org/wiki/Cram_%28games%29";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createElement("a");
winnerFromStart.href = "http://sprouts.tuxfamily.org/wiki/doku.php?id=records#cram";
winnerFromStart.appendChild(document.createTextNode("Odd-by-Even: First Player"));
winnerFromStart.appendChild(document.createElement("br"));
winnerFromStart.appendChild(document.createTextNode("Even-by-Even: Second Player"));
winnerFromStart.appendChild(document.createElement("br"));
winnerFromStart.appendChild(document.createTextNode("Odd-by-Odd: Varies"));
var computationalComplexity = document.createTextNode("In PSPACE");
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addVariant(variant);

variant.addBriefDescription("Impartial Domineering: each player can play dominoes in either orientation.");
 
//NoCanDo
var rulesetName = "NoCanDo";
var rulesetInfoHref = null;
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = "unknown";
var computationalComplexity = document.createTextNode("In PSPACE");
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addVariant(variant);

variant.addBriefDescription("Domineering with liberties: each domino must always be adjacent to an open space.");

variant.addBlogLink("http://combinatorialgametheory.blogspot.com/2017/07/game-description-nocando.html");

rulesetPropertiesList.push(properties);


/////////////////////////////////////////////////////////////////////////////////
//Dots and Boxes
var rulesetName = "Dots-and-Boxes";
var rulesetInfoHref = "http://en.wikipedia.org/wiki/Dots_and_boxes";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("?");
var computationalComplexity = document.createTextNode("In PSPACE");
var otherProperties = document.createTextNode("Not Strictly Combinatorial");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Dots-and-boxes.svg/228px-Dots-and-boxes.svg.png");

properties.addPlayableLink("http://www.math.ucla.edu/~tom/Games/dots&boxes.html", "JavaScript");

rulesetPropertiesList.push(properties);

////////////////////////// 
//Draughts
var rulesetName = "Draughts";
var rulesetInfoHref = "https://en.wikipedia.org/wiki/Draughts";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(false);
var winnerFromStart = "?";
var computationalComplexity = createLink("EXPTIME-complete", "https://doi.org/10.1137/0213018");
var otherProperties = " ";
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addBriefDescription("Move pieces one diagonal space forward or jump an opposing piece.  After advancing to the far side (the opponent's side), pieces can move in any direction."); //fill in

properties.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Draughts.svg/240px-Draughts.svg.png"); //fill in

properties.addAlias("Checkers"); 



rulesetPropertiesList.push(properties); /* */


/////////////
// <E>


/////////////
// <F>
 
//Fjords
var rulesetName = "Fjords";
var rulesetInfoHref = "https://en.wikipedia.org/wiki/Fjords_%28board_game%29";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("No standard starting configuration.");
var computationalComplexity = createElementWithChildren("span", [createLink("PSPACE-complete, even on planar graphs", BURKE_HEARN_2018)]);
var otherProperties = document.createTextNode("Only the second phase of the commercial game is strictly combinatorial.");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.setImage("http://timo.herd.fi/images/fjords.jpg");

properties.addBlogLink("http://combinatorialgametheory.blogspot.com/2010/04/game-description-fjords.html");

rulesetPropertiesList.push(properties);
 
//Flume
var rulesetName = "Flume";
var rulesetInfoHref = "http://www.marksteeregames.com/Flume_Go_rules.pdf";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("?");
var computationalComplexity = document.createTextNode("In PSPACE");
var otherProperties = document.createTextNode(" ");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.setImage("http://2.bp.blogspot.com/-b3mx9TgH208/Tlxfd0sEM4I/AAAAAAAAAFs/SSJRrpD6bqs/s1600/Screen+shot+2011-08-29+at+10.56.13+PM.png");

properties.addBlogLink("http://combinatorialgametheory.blogspot.com/2010/02/game-description-flume.html");

rulesetPropertiesList.push(properties);




//////////////////////////////////////////////////////////////////////
// <G>
 
//Geography
var rulesetName = "Geography";
var rulesetInfoHref = "http://en.wikipedia.org/wiki/Generalized_geography";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("Varies");
var computationalComplexity = document.createElement("span");
appendChildrenTo(computationalComplexity, ["Normal play: ", createLink("PSPACE-complete", "http://en.wikipedia.org/wiki/Generalized_geography#Proof"), ", even on ", createLink("planar graphs", "http://dx.doi.org/10.1016/0304-3975(93)90357-Y"), "; Misère play: ", createLink("PSPACE-complete", RENAULT_SCHMIDT_2015)]);
;
var otherProperties = toNode(" ");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addAlias("Directed-Vertex Geography");
properties.addAlias("Generalized Geography");

properties.setImage("http://upload.wikimedia.org/wikipedia/commons/1/11/Generalized_geography_2.png");

properties.addBriefDescription("Position: directed graph and a current vertex.  Move: travel an outgoing arc to a new vertex, delete the previous current vertex.");

rulesetPropertiesList.push(properties);



//Geography variant: Undirected-Vertex Geography
var rulesetName = "Undirected-Vertex Geography";
var rulesetInfoHref = "http://dx.doi.org/10.1016/0304-3975(93)90026-P";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("Varies");
var computationalComplexity = createElementWithChildren("span", ["Normal Play: ", createTextLink("in P", "http://dx.doi.org/10.1016/0304-3975(93)90026-P"), ", Misère play: ", createLink("PSPACE-complete", RENAULT_SCHMIDT_2015)]); 
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addBriefDescription("Just like Geography, but on an undirected graph.");

properties.addVariant(variant);

//Geography variant: Directed-Edge Geography
var rulesetName = "Edge Geography";
var rulesetInfoHref = "http://dx.doi.org/10.1016/0022-0000(78)90045-4";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("Varies");
var computationalComplexity = createTextLink("PSPACE-complete", "http://dx.doi.org/10.1016/0022-0000(78)90045-4");
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addAlias("Directed Edge Geography");

variant.addBriefDescription("Just like Geography, but when a player moves, they only delete the arc traversed, not the vertex they left.");

properties.addVariant(variant);

//Geography variant: Undirected-Edge Geography
var rulesetName = "Undirected Edge Geography";
var rulesetInfoHref = "http://dx.doi.org/10.1016/0304-3975(93)90026-P";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("Varies");
var computationalComplexity = createTextLink("PSPACE-complete", "http://dx.doi.org/10.1016/0304-3975(93)90026-P");
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addBriefDescription("Just like Edge Geography, but on an undirected graph.");

properties.addVariant(variant);

//Geography variant:Partizan Geography
var rulesetName = "Partizan Geography";
var rulesetInfoHref = "http://dx.doi.org/10.1016/0304-3975(93)90356-X";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("Varies");
var computationalComplexity = createTextLink("PSPACE-complete", "http://dx.doi.org/10.1016/0304-3975(93)90356-X");
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addBriefDescription("Just like Geography, but each player has their own current vertex they move.");

properties.addVariant(variant);





//Geography variant Edge NimG
var rulesetName = "Edge NimG";
var rulesetInfoHref = FUKUYAMA_2003;
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("Varies");
var computationalComplexity = toNode("In EXPTIME");
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addBriefDescription("Undirected Geography, but with a Nim heap on each edge.  As a player moves across an edge, they must also make a play on the edge's heap (remove sticks).  Cannot traverse edges with zero-size heaps.");

properties.addVariant(variant);



//Geography variant Vertex NimG
var rulesetName = "Vertex NimG";
var rulesetInfoHref = STOCKMAN_2004;
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("Varies");
var computationalComplexity = createElementWithChildren("span", ["Normal play: ", createLink("in P (with and without loops)", "https://doi.org/10.1016/j.tcs.2013.11.025"), ", Misère play: ", createLink("in P when loops are everywhere, but otherwise PSPACE-hard", RENAULT_SCHMIDT_2015), " (and in EXPTIME)"]);
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addAlias("NimG-RM");
variant.addBriefDescription("Undirected Geography, but with a Nim heap on each vertex.  Each turn consists of playing on the heap on the current vertex, then moving to an adjacent vertex.  There are no move options from a vertex with an empty heap. (RM stands for Remove, then Move.)");

properties.addVariant(variant);



//Geography variant NimG-MR
var rulesetName = "NimG-MR";
var rulesetInfoHref = "http://dx.doi.org/10.1016/j.tcs.2013.11.025";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("Varies");
var computationalComplexity = createElementWithChildren("span", ["In EXPTIME, Normal play: ", createLink("PSPACE-hard with loops", BURKE_GEORGE_2019), ", Misère play: ", createLink("PSPACE-hard", RENAULT_SCHMIDT_2015)]);
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addAlias("Neighboring Nim (with loops everywhere)");

variant.addBriefDescription("NimG-RM, except you move first, then play on the resulting heap.  Cannot move to a vertex with a heap zero.  (MR stands for Move, then Remove.)");

properties.addVariant(variant);




//Geography variant VertexNim
var rulesetName = "(Directed) VertexNim";
var rulesetInfoHref = DUCHENE_RENAULT_2014;
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("Varies");
var computationalComplexity = createElementWithChildren("span", ["Normal play: ", createLink("in P with self-loops everywhere", DUCHENE_RENAULT_2014), ", in EXPTIME otherwise.  Misère play: ", createLink("in P", DUCHENE_RENAULT_2014)]);
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addBriefDescription("Just like Vertex NimG-RM, except when a heap becomes 0, that vertex is removed and it's neighbors becomes a clique.");

properties.addVariant(variant);


//Geography variant VertexNim
var rulesetName = "Undirected VertexNim";
var rulesetInfoHref = DUCHENE_RENAULT_2014;
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("Varies");
var computationalComplexity = createElementWithChildren("span", ["Normal and Misère play: ", createLink("in P", DUCHENE_RENAULT_2014)]);
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addBriefDescription("VertexNim on undirected graphs");

properties.addVariant(variant);





//////////////////////////
//Go
var rulesetName = "Go";
var rulesetInfoHref = "http://senseis.xmp.net/?RulesOfGo";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(false);
var winnerFromStart = document.createTextNode("First Player");
var computationalComplexity = createTextLink("EXPTIME-complete", "http://senseis.xmp.net/?RobsonsProofThatGOIsEXPTimeHard");
var otherProperties = document.createTextNode(" ");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/FloorGoban.JPG/248px-FloorGoban.JPG");

rulesetPropertiesList.push(properties);

//Go variant 
var rulesetName = "with Superko";
var rulesetInfoHref = "http://senseis.xmp.net/?Superko";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(false);
var winnerFromStart = document.createTextNode("?");
var computationalComplexity = createTextLink("PSPACE-hard; In EXPSPACE", "http://dl.acm.org/citation.cfm?id=322201");
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addVariant(variant);


////////////////////////// 
//Godomachi
var rulesetName = "Godomachi";
var rulesetInfoHref = "https://j344.exblog.jp/238344979/";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = "No standard start";
var computationalComplexity = "In PSPACE";
var otherProperties = " ";
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addBriefDescription("Players remove the same object from two polyominos, winning if the resulting polyominos are congruent."); //fill in

properties.setImage("https://pds.exblog.jp/pds/1/201802/20/87/a0180787_00302822.png"); //fill in

properties.addAlias("Congruence Matching Game"); //if applicable

//properties.addPlayableLink("http://www.fwend.com/gameofcol.htm", "Java");

//properties.addBlogLink("http://combinatorialgametheory.blogspot.com/2010/02/game-description-...html");

rulesetPropertiesList.push(properties); /* */
 

//////////////////////////
//Gomoku
var rulesetName = "Gomoku";
var rulesetInfoHref = "https://en.wikipedia.org/wiki/Gomoku";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = createTextLink("First player", "http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.99.5364");
var computationalComplexity = createTextLink("PSPACE-complete", "https://dx.doi.org/10.1007%2Fbf00288536");
var otherProperties = " ";
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.setImage("http://gomokuworld.com/site/pictures/images/introduction_of_gomoku_004.gif");

variant.addBriefDescription("5-in-a-row, horizontal, vertical, or diagonal.");

properties.addAlias("Go-bang");
properties.addAlias("Omok");
properties.addAlias("5-in-a-row");

rulesetPropertiesList.push(properties);

//Gomoku variant: Renju
var rulesetName = "Renju";
var rulesetInfoHref = "https://en.wikipedia.org/wiki/Renju";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(false);
var winnerFromStart = "?";
var computationalComplexity = "?";
var otherProperties = " ";

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addVariant(variant);

//Gomoku variant: Pente
var rulesetName = "Pente";
var rulesetInfoHref = "https://en.wikipedia.org/wiki/Pente";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(false);
var winnerFromStart = "?";
var computationalComplexity = "?";
var otherProperties = " ";

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addVariant(variant);


 

//////////////////////////
//Grundy's Game
var rulesetName = "Grundy's Game";
var rulesetInfoHref = "https://en.wikipedia.org/wiki/Grundy%27s_game";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = "varies";
var computationalComplexity = "?";
var otherProperties = " ";
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);


variant.addBriefDescription("On a list of piles of objects, a player may split any pile into two new piles with different numbers of tokens.");


rulesetPropertiesList.push(properties);


///////////////////
// <H>

////////////////////////
//Hackenbush
var rulesetName = "Hackenbush";
var rulesetInfoHref = "https://en.wikipedia.org/wiki/Hackenbush";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("?");
var computationalComplexity = unpublished("NP-hard");
//document.createElement("span");
//computationalComplexity.appendChild(toNode("NP-hard"));
//computationalComplexity.innerHTML += "&#8224;";
var otherProperties = document.createTextNode("Hard even without green edges.");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Hackenbush_girl.svg/495px-Hackenbush_girl.svg.png");

properties.addBriefDescription("Position: (planar?) graph with red, green, and blue edges with some vertices attached to the ground line.  Move: erase a green edge or an edge of your color, then destroy any edges no longer connected to the ground.");

rulesetPropertiesList.push(properties);

//TODO: add Oak as a variant
 
 
////////////////////////////////////////////
//Hanoi Stick-Up
var rulesetName = "Hanoi Stick-Up";
var rulesetInfoHref = null;
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("?");
var computationalComplexity = document.createTextNode("In PSPACE");
var otherProperties = document.createTextNode(" ");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.setImage("http://3.bp.blogspot.com/-9D4FOuCef3o/T9sFH1kYasI/AAAAAAAAADo/TaTDe0nMgsM/s1600/towerofhanoi.jpg");

properties.addBlogLink("http://combinatorialgametheory.blogspot.com/2010/04/game-description-hanoi-stick-up.html");

rulesetPropertiesList.push(properties);

 
////////////////////////////////// 
//Hex
var rulesetName = "Hex";
var rulesetInfoHref = "http://web.ukonline.co.uk/arthur.vause/Hex.html";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("No Pie Rule: First Player;  With Pie Rule: Previous Player");
var computationalComplexity = createTextLink("PSPACE-complete", "http://maarup.net/thomas/hex/");
var otherProperties = document.createTextNode("This version is Dicotic.");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.setImage("http://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Hex_board_11x11.svg/300px-Hex_board_11x11.svg.png?alignright.jpg");

properties.addPlayableLink("http://www.mazeworks.com/hex7/index.htm", "Java");

properties.addBriefDescription("On diamond-shaped hexagonal grid, two opposite sides colored blue and two red.  Players take turns coloring hexagons.  Once a player has created a contiguous path connecting their two sides, no more moves can be made.");

rulesetPropertiesList.push(properties);

//Hex Variant: Rex
var rulesetName = "Rex (Misère Hex)";
var rulesetInfoHref = null;
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = createTextLink("Even-sized board: first player;  Odd-size: previous player", "http://www.cs.cmu.edu/~sleator/papers/Misere-Hex.pdf");
var computationalComplexity = document.createTextNode("In PSPACE");
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addBriefDescription("Misère version of Hex.");

properties.addVariant(variant);

//Hex Variant: Winner-Take-All Hex
var rulesetName = "Winner-Take-All Hex";
var rulesetInfoHref = null;
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = createTextLink("Same as Hex: the first player in the absence of the pie rule.");
var computationalComplexity = document.createTextNode("In PSPACE");
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addBriefDescription("Just as Hex, except that once a player makes a connection, they may still make plays (but the other player may not).");

properties.addVariant(variant);

//Hex Variant: Adjex
var rulesetName = "Adjex (Adjacent Hex)";
var rulesetInfoHref = null;
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("?");
var computationalComplexity = document.createTextNode("In PSPACE.  PSPACE-complete?  (I believe the original reduction by Reisch still applies)");
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addBlogLink("http://combinatorialgametheory.blogspot.com/2011/01/game-description-adjacent-hex.html");

variant.addBriefDescription("Each player must play adjacent to the last piece played.  If there are no spaces adjacent to the last play, the next player may play anywhere.");

properties.addVariant(variant);

//Hex variant: Whex
var rulesetName = "Whex (Weak Hex)";
var rulesetInfoHref = "http://www.doc.ic.ac.uk/%7Ear3/LDS&CONDITIONALS.pdf";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("No Pie Rule: First Player");
var computationalComplexity = document.createDocumentFragment();
computationalComplexity.appendChild(createTextLink("General graphs: PSPACE-complete", "http://www.doc.ic.ac.uk/%7Ear3/LDS&CONDITIONALS.pdf"));
computationalComplexity.appendChild(document.createElement("br"));
computationalComplexity.appendChild(document.createTextNode("Hex board: in PSPACE."));
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addBlogLink("http://combinatorialgametheory.blogspot.com/2011/02/game-description-weak-hex-whex.html");

variant.addBriefDescription("One player is the leader, the other is the follower.  Both players must play adjacent to the leader's last move.  If no such space is available, then the next player loses.");

properties.addVariant(variant);

//Hex variant: Flex
var rulesetName = "Flex (Follow-the-Leader Hex)";
var rulesetInfoHref = null;
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("No Pie Rule: First Player");
var computationalComplexity = document.createTextNode("In PSPACE");
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addBlogLink("http://combinatorialgametheory.blogspot.com/2011/02/game-description-weak-hex-whex.html");

variant.addBriefDescription("Just as Whex, except when no adjacent space is available, the next player may play wherever they like and they become the leader.");

properties.addVariant(variant); 

//hex variant
var rulesetName = "Only-Red Impartial Hex";
var rulesetInfoHref = "http://dx.doi.org/10.1016/0022-0000(78)90045-4";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("unknown");
var computationalComplexity = toNode("In PSPACE");
var otherProperties = toNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addBriefDescription("Both players play red pieces.  Once a connection is made, no more pieces may be played.");

properties.addVariant(variant); 

//hex variant: impartial hex
var rulesetName = "Either-Color Hex";
var rulesetInfoHref = null;
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("unknown");
var computationalComplexity = toNode("In PSPACE");
var otherProperties = toNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addBriefDescription("The same as Only-Red Impartial Hex, except players may play either color.");

properties.addVariant(variant); 

//end of Hex


////////////////////////////////// 
//Hey That's My Fish
var rulesetName = "Hey That's My Fish";
var rulesetInfoHref = "https://boardgamegeek.com/boardgame/8203/hey-s-my-fish";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("Random Starting Positions");
var computationalComplexity = "?";
var otherProperties = document.createTextNode("Scoring Game.\nHas every value born by day 2.", "https://ipsj.ixsq.nii.ac.jp/ej/?action=repository_uri&item_id=199970&file_id=1&file_no=1");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.setImage("https://upload.wikimedia.org/wikipedia/commons/7/7e/Deskohran%C3%AD_08s4_075_-_Hey%21_That%27s_My_Fish%21.jpg");


properties.addBriefDescription("Partisan Penguins move around on a hexagonal board.  Each turn consists of moving one penguin as many spaces as the player wants in one direction, without hopping over empty spaces or opposing penguins.  After moving, the player removes the tile the penguin started on, adding to their score the number of fish that were on that tile.");

rulesetPropertiesList.push(properties);


///////////////////
// <I>


///////////////////
// <J>


///////////////////
// <K>
 
///////////////////
//Kayles
var rulesetName = "Kayles (Node Kayles)";
var rulesetInfoHref = "http://erikdemaine.org/papers/AlgGameTheory_GONC3/";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("No standard starting positions.");
var computationalComplexity = createTextLink("PSPACE-complete", "http://dx.doi.org/10.1016/0022-0000(78)90045-4");
var otherProperties = document.createTextNode(" ");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addBriefDescription("Played on a graph.  Move: choose one vertex and remove it and all direct neighbors.");

properties.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Independent_set_graph.svg/240px-Independent_set_graph.svg.png");

//properties.addBlogLink("http://combinatorialgametheory.blogspot.com/2010/02/game-description-...html");

rulesetPropertiesList.push(properties);


//Kayles variant: Bowling Kayles
var rulesetName = "Bowling Kayles";
var rulesetInfoHref = "https://www.gutenberg.org/files/27635/27635-h/27635-h.htm#Page_118";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("First player (more than zero pins).");
var computationalComplexity = createTextLink("In P", "http://en.wikipedia.org/wiki/Kayles#Analysis");
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addBriefDescription("Played on a row of bowling pins.  Move: remove either one pin or two pins that are directly next to each other.");

variant.addPlayableLink("http://www.cut-the-knot.org/Curriculum/Arithmetic/Kayles.shtml", "Java");

properties.addVariant(variant);


//Kayles variant: Popping Balloons
var rulesetName = "Popping Balloons";
var rulesetInfoHref = "https://turing.plymouth.edu/~kgb1013/DB/combGames/poppingBalloons.html";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("First player from full grid.");
var computationalComplexity = "unknown;
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addBriefDescription("Position is a grid of balloons, some popped.  A turn consists of popping either one balloon, two neighboring balloons, or any of the 1 to 4 remaining balloons in a square.");

variant.addPlayableLink("https://turing.plymouth.edu/~kgb1013/DB/combGames/poppingBalloons.html", "JavaScript");

properties.addVariant(variant);


//Kayles variant: Dawson's Kayles
var rulesetName = "Dawson's Kayles";
var rulesetInfoHref = null;
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("?");
var computationalComplexity = document.createTextNode("In PSPACE");
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

//variant.addAlias("Dawson's Chess");  (No, it isn't.  These are different.)

variant.addPlayableLink("http://www.cut-the-knot.org/Curriculum/Games/DawsonKayles.shtml", "Java");

properties.addVariant(variant);

//Kayles variant: Bigraph Node Kayles
var rulesetName = "Bigraph Node Kayles";
var rulesetInfoHref = "http://dx.doi.org/10.1016/0022-0000(78)90045-4";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("depends");
var computationalComplexity = createTextLink("PSPACE-complete", "http://dx.doi.org/10.1016/0022-0000(78)90045-4");
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addBriefDescription("Same as Node Kayles, except played on bipartite graph, Left must choose from vertices on the left side and vice versa.");

properties.addVariant(variant);

//Kayles variant: Arc Kayles
var rulesetName = "Arc Kayles";
var rulesetInfoHref = null;
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("?");
var computationalComplexity = document.createTextNode("In PSPACE");
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addBriefDescription("Same as Node Kayles, except choose and remove edges instead of vertices.");

properties.addVariant(variant);

//Kayles variant: Impartial Cutthroat
var rulesetName = "Impartial Cutthroat";
var rulesetInfoHref = null;
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("No standard starting positions.");
var computationalComplexity = document.createTextNode("In PSPACE");
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addBriefDescription("Same as Node Kayles, except chosen vertex must have a neighbor, and you only remove the chosen vertex.");

variant.addBlogLink("http://combinatorialgametheory.blogspot.com/2017/06/game-description-cutthroat-and.html");

properties.addVariant(variant);

//end of Kayles

 
/////////////////////////// 
//Konane
var rulesetName = "Konane";
var rulesetInfoHref = "http://en.wikipedia.org/wiki/Konane";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("?");
var computationalComplexity = createTextLink("PSPACE-complete", "http://www.dartmouth.edu/~rah/amazons.pdf");
var otherProperties = document.createTextNode("Contains all short game values.");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.setImage("http://www.konanebrothers.com/march_2010_043_op_690x517.jpg");

properties.addPlayableLink("http://www.cs.swarthmore.edu/~meeden/konane/carlisle/Konane.html", "Java");

rulesetPropertiesList.push(properties);


///////////////////
// <M>


///////////////////
//Mad Rooks
var rulesetName = "Mad Rooks";
var rulesetInfoHref = "http://www.marksteeregames.com/Mad_Rooks_rules.pdf";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("?");
var computationalComplexity = document.createTextNode("In PSPACE");
var otherProperties = document.createTextNode(" ");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.setImage("http://cdn4.staztic.com/cdn/screenshot/comapplicationmadrooks-2-1.jpg");

properties.addBlogLink("http://combinatorialgametheory.blogspot.com/2011/02/game-description-mad-rooks.html");

rulesetPropertiesList.push(properties);


///////////////////
//Manalath
var rulesetName = "Manalath";
var rulesetInfoHref = "https://spielstein.com/games/manalath/rules";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("?");
var computationalComplexity = document.createTextNode("In PSPACE");
var otherProperties = document.createTextNode(" ");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.setImage("https://spielstein.com/images/games/manalath/rules/winorloss.png");

properties.addBlogLink("http://combinatorialgametheory.blogspot.com/2016/03/game-description-manalath.html");

properties.addBriefDescription("Players have colors, but you can play either color on your turn.  Can't have component of 6+ in one color.  Component of 5 in your color: you win.  Component of 4 in your color at the end of your turn: you lose.");

rulesetPropertiesList.push(properties);
 
 
///////////////////////// 
//Martian Chess
var rulesetName = "Martian Chess";
var rulesetInfoHref = "http://www.wunderland.com/icehouse/MartianChess.html";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(false);
var winnerFromStart = document.createTextNode("?");
var computationalComplexity = document.createTextNode("?");
var otherProperties = document.createTextNode(" ");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.setImage("http://www.supermaze.com/mc.png");

properties.addBlogLink("http://combinatorialgametheory.blogspot.com/2010/09/game-description-martian-chess.html");

rulesetPropertiesList.push(properties);


///////////////////
// <N>
 
/////////////////// 
//Nim
var rulesetName = "Nim";
var rulesetInfoHref = "http://en.wikipedia.org/wiki/Nim";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("By XOR-rule.");
var computationalComplexity = createTextLink("In P", "http://en.wikipedia.org/wiki/Nim#Mathematical_theory");
var otherProperties = document.createTextNode(" ");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addAlias("Sticks (misere)");

properties.setImage("http://ljkrakauer.com/LJK/60s/marienbadgame.jpg");

properties.addBriefDescription("Position: piles of sticks.  Move: choose one pile and remove any number of sticks from it.");

properties.addPlayableLink("http://www.archimedes-lab.org/game_nim/play_nim_game.html", "JavaScript");

rulesetPropertiesList.push(properties);

//Nim variant: Antonim
var rulesetName = "Antonim";
var rulesetInfoHref = "";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("?");
var computationalComplexity = document.createTextNode("In EXPTIME");
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addBriefDescription("Position: set of piles instead of a multiset.  Same as Nim, but if two or more piles have the same size, one is dropped."); 

properties.addVariant(variant); /* */

//Nim variant: Circular Nim
var rulesetName = "Circular Nim";
var rulesetInfoHref = "http://www.combinatorics.org/ojs/index.php/eljc/article/view/v20i2p22";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("?");
var computationalComplexity = document.createTextNode("In EXPTIME");
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addBriefDescription("A circular Nim game is a two player impartial combinatorial game consisting of n stacks of tokens placed in a circle. A move consists of choosing k consecutive stacks, and taking at least one token from one or more of the k stacks."); 

properties.addVariant(variant); /* */


//Nim variant: Gale's Nim
var rulesetName = "Gale's Nim";
var rulesetInfoHref = null;
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("?");
var computationalComplexity = document.createTextNode("In EXPTIME");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addBriefDescription("Gale's Nim (X, Y) is the same as Nim played on X heaps, except that the game ends when there are only Y remaining non-zero piles.  Gale's Game is the special case of this when Y = 1.  (Nim is the special case when Y = 0.)"); 

properties.addVariant(variant); /* */


//Nim variant: Penultimate Nim
var rulesetName = "Penultimate Nim";
var rulesetInfoHref = null;
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("?");
var computationalComplexity = toNode("?");
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addBriefDescription("Just like Nim, but the game ends when there is exactly one pile left."); 

properties.addVariant(variant); /* */

//Nim variant: Supernim
var rulesetName = "Supernim";
var rulesetInfoHref = "https://www.reddit.com/r/math/comments/33sjzy/a_combinatorial_game_xpost_rmathriddles/";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("?");
var computationalComplexity = document.createTextNode("In PSPACE");
var otherProperties = document.createTextNode("Extendable to n degrees.");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addBriefDescription("Initial position: n x m grid of dots.  Move: remove any amount of dots all parallel to one of the axes.  (Doesn't have to be contiguous.)"); 

properties.addVariant(variant); /* */


 
//////////////////////// 
//NoGo
var rulesetName = "NoGo";
var rulesetInfoHref = "http://senseis.xmp.net/?AntiAtariGo";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("?");
var computationalComplexity = document.createTextNode("In PSPACE");
var otherProperties = document.createTextNode(" ");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addAlias("Anti-Atari Go");
properties.addAlias("NoCaptureGo");

properties.setImage("http://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Gochsurule.png/200px-Gochsurule.png");

properties.addBlogLink("http://combinatorialgametheory.blogspot.com/2010/11/game-description-nogo.html");

properties.addBriefDescription("Go, but no capturing moves are allowed.  Take turns placing stones of your color, but after each placement all contiguous regions must be adjacent to an empty space.  (Yes, your opponent's regions also.)");

rulesetPropertiesList.push(properties);


///////////////////
// <O>
 
///////////////////////// 
//Othello
var rulesetName = "Othello";
var rulesetInfoHref = "http://en.wikipedia.org/wiki/Reversi";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("?");
var computationalComplexity = document.createTextNode("In PSPACE");
var otherProperties = document.createTextNode(" ");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addAlias("Reversi");

properties.setImage("https://upload.wikimedia.org/wikipedia/commons/2/20/Othello-Standard-Board.jpg");

properties.addPlayableLink("http://hewgill.com/othello/", "JavaScript");

rulesetPropertiesList.push(properties);


///////////////////
// <P>


////////////////////
//Parity Game
var rulesetName = "The Parity Game";
var rulesetInfoHref = "https://en.wikipedia.org/wiki/Parity_game";
var isImpartial = false;
var isShortNode = "?";
var winnerFromStart = "?";
var computationalComplexity = "?";
var otherProperties = document.createTextNode(" ");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Example_Parity_Game_Solved.png/300px-Example_Parity_Game_Solved.png");

properties.addBriefDescription("???");

rulesetPropertiesList.push(properties);


/////////////////////
//Pentalath
var rulesetName = "Pentalath";
var rulesetInfoHref = "http://cameronius.com/games/pentalath/";
var isImpartial = false;
var isShortNode = "?";
var winnerFromStart = "?";
var computationalComplexity = "?";
var otherProperties = document.createTextNode(" ");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addAlias("Ndengrod");

properties.setImage("http://cambolbro.com/games/pentalath/ndengrod-capture-1.png");

properties.addBriefDescription("Five in a row wins; enemy pieces are removed if their contiguous group is not adjacent to an open space.");

rulesetPropertiesList.push(properties);
 
 
/////////////////////// 
//Phutball
var rulesetName = "Phutball";
var rulesetInfoHref = "http://www.ics.uci.edu/~eppstein/cgt/hard.html#phutball";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(false);
var winnerFromStart = document.createTextNode("?");
var computationalComplexity = document.createTextNode("PSPACE-hard");
var otherProperties = document.createTextNode("Determining whether you can win this turn is NP-hard.");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.setImage("http://superdupergames.org/images/phutball-board.png");

properties.addPlayableLink("http://conwaygo.sourceforge.net/applet.html", "Java");

properties.addBlogLink("http://combinatorialgametheory.blogspot.com/2010/02/game-description-phutball.html");

rulesetPropertiesList.push(properties);


///////////////////
// <Q>
 
//////////////////// 
//QBF
var rulesetName = "Quantified Boolean Formula";
var rulesetInfoHref = "https://en.wikipedia.org/wiki/Formula_game";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("depends");
var computationalComplexity = document.createElement("span");
appendChildrenTo(computationalComplexity, [createTextLink("PSPACE-complete on 3-CNF", "http://www.pearsonhighered.com/educator/product/Computational-Complexity/9780201530827.page"), toNode(", but "), createTextLink("easy on 2-CNF", "http://dx.doi.org/10.1016/0020-0190(79)90002-4")]);
var otherProperties = document.createTextNode(" ");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.setImage("http://ramos.elo.utfsm.cl/~lsb/elo320/aplicaciones/aplicaciones/CS460AlgorithmsandComplexity/lecture25/COMP460%20Algorithms%20and%20Complexity%20Lecture%2025_archivos/npc3a.gif");


properties.addAlias("Formula Game");

properties.addBlogLink("http://combinatorialgametheory.blogspot.com/2015/03/schaefers-boolean-formula-games.html");

rulesetPropertiesList.push(properties);


//QBF variant: either-anywhere-different
var rulesetName = "Unrestricted QBF";
var rulesetInfoHref = "http://combinatorialgametheory.blogspot.com/2015/03/schaefers-boolean-formula-games.html";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("depends");
var computationalComplexity = createTextLink("PSPACE-complete on positive 11-CNF and positive 11-DNF", "http://dx.doi.org/10.1016/0022-0000(78)90045-4");
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addVariant(variant);


//QBF variant: by-player-anywhere-same
var rulesetName = "Positive QBF";
var rulesetInfoHref = "http://combinatorialgametheory.blogspot.com/2015/03/schaefers-boolean-formula-games.html";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("depends");
var computationalComplexity = createTextLink("PSPACE-complete on 11-CNF and 11-DNF", "http://dx.doi.org/10.1016/0022-0000(78)90045-4");
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addVariant(variant);

//QBF variant 
var rulesetName = "Partitioned Variables QBF";
var rulesetInfoHref = "http://combinatorialgametheory.blogspot.com/2015/03/schaefers-boolean-formula-games.html";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("depends");
var computationalComplexity = createTextLink("PSPACE-complete on CNF", "http://dx.doi.org/10.1016/0022-0000(78)90045-4");
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addVariant(variant);

//QBF variant 
var rulesetName = "Positive Avoid-True";
var rulesetInfoHref = "http://combinatorialgametheory.blogspot.com/2015/03/schaefers-boolean-formula-games.html";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("depends");
var computationalComplexity = createTextLink("PSPACE-complete on CNF and 2-DNF", "http://dx.doi.org/10.1016/0022-0000(78)90045-4");
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addVariant(variant);

//QBF variant 
var rulesetName = "Partitioned Positive Avoid-True";
var rulesetInfoHref = "http://combinatorialgametheory.blogspot.com/2015/03/schaefers-boolean-formula-games.html";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("depends");
var computationalComplexity = createTextLink("PSPACE-complete on CNF and 2-DNF", "http://dx.doi.org/10.1016/0022-0000(78)90045-4");
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addVariant(variant);

//QBF variant 
var rulesetName = "Positive Seek-True";
var rulesetInfoHref = "http://combinatorialgametheory.blogspot.com/2015/03/schaefers-boolean-formula-games.html";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("depends");
var computationalComplexity = createTextLink("PSPACE-complete on CNF, 3-DNF", "http://dx.doi.org/10.1016/0022-0000(78)90045-4");
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addVariant(variant);

//QBF variant 
var rulesetName = "Partitioned Positive Seek-True";
var rulesetInfoHref = "http://combinatorialgametheory.blogspot.com/2015/03/schaefers-boolean-formula-games.html";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("depends");
var computationalComplexity = createTextLink("PSPACE-complete on CNF, 3-DNF", "http://dx.doi.org/10.1016/0022-0000(78)90045-4");
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addVariant(variant);

//QBF variant: by-player-anywhere-different
var rulesetName = "Partisan Lazy Avoid-False";
var rulesetInfoHref = "http://arxiv.org/abs/1401.3687";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = toNode("depends");
var computationalComplexity = createTextLink("PSPACE-complete on 2-CNF", "http://arxiv.org/abs/1401.3687");
var otherProperties = toNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addVariant(variant);

//QBF variant: either-anywhere-same
var rulesetName = "Lazy Avoid-False";
var rulesetInfoHref = "http://arxiv.org/abs/1401.3687";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = toNode("depends");
var computationalComplexity = document.createElement("span");
appendChildrenTo(computationalComplexity, [createTextLink("PSPACE-complete on 2-CNF", "http://arxiv.org/abs/1401.3687")]);
var otherProperties = toNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addVariant(variant);

//QBF variant: either-local-same
var rulesetName = "Restricted Lazy Avoid-False";
var rulesetInfoHref = "http://arxiv.org/abs/1401.3687";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = toNode("depends");
var computationalComplexity = document.createElement("span");
appendChildrenTo(computationalComplexity, [createTextLink("PSPACE-complete on 4-CNF", "http://arxiv.org/abs/1401.3687")]);
var otherProperties = toNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addVariant(variant);


/////////////////////////
// <S>
 
//////////////////// 
//Sift
var rulesetName = "Sift";
var rulesetInfoHref = "http://dx.doi.org/10.1016/0022-0000(78)90045-4";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("depends");
var computationalComplexity = createTextLink("PSPACE-complete", "http://dx.doi.org/10.1016/0022-0000(78)90045-4");
var otherProperties = document.createTextNode(" ");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

rulesetPropertiesList.push(properties);

 
//////////////////// 
//Six
var rulesetName = "Six";
var rulesetInfoHref = "https://boardgamegeek.com/boardgame/20195/six";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(false);
var winnerFromStart = "?";
var computationalComplexity = "In EXPTIME";
var otherProperties = document.createTextNode(" ");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

rulesetPropertiesList.push(properties);

properties.setImage(getPublicFileLink("combGames/sixHexGame.jpg")); 

properties.addBriefDescription("Place a hexagon of your color and try to create either six-in-a-row, a loop of six pieces, or a triangle of six pieces.");
 
 
////////////////////// 
//Slimetrail
var rulesetName = "Slimetrail";
var rulesetInfoHref = "https://boardgamegeek.com/boardgame/31467/slimetrail";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = "unknown"

var computationalComplexity = createLink("PSPACE-complete on planar graphs", "https://arxiv.org/abs/1712.04496");
var otherProperties = document.createTextNode(" ");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.setImage("https://cf.geekdo-images.com/tYxS-l2Z8FkehH7eIQFY9A__itemrep/img/tn0-_WlInvsFeR37rPMbEgW4AiY=/fit-in/246x300/filters:strip_icc()/pic332409.jpg");

properties.addBriefDescription("Alternate moving the token, but not to a previously-occupied space.  Win by moving to your goal space.");

properties.addPlayableLink("http://turing.plymouth.edu/~kgb1013/combGames/slimeTrail.html", "JavaScript");

properties.addBlogLink("http://combinatorialgametheory.blogspot.com/2017/07/game-description-slimetrail.html");

rulesetPropertiesList.push(properties);
 
 
////////////////////// 
//Slipe
var rulesetName = "Slipe";
var rulesetInfoHref = null;
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(false);
var winnerFromStart = "unknown"

var computationalComplexity = document.createTextNode("In EXPTIME");
var otherProperties = document.createTextNode(" ");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.setImage(getPublicFileLink("combGames/slipeStart.jpg"));

properties.addBriefDescription("Move pieces in 4 cardinal directions, but must move as far as they can go.  (Boundaries block sides.)  Win by getting marked piece to land in goal (center square).");

rulesetPropertiesList.push(properties);


/////////////////////// 
//Snort
var rulesetName = "Snort";
var rulesetInfoHref = "https://en.wikipedia.org/wiki/Col_%28game%29";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("depends");
var computationalComplexity = createTextLink("PSPACE-complete", "http://dx.doi.org/10.1016/0022-0000(78)90045-4");
var otherProperties = document.createTextNode(" ");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addAlias("Cats and Dogs");

rulesetPropertiesList.push(properties);

//Snort variant: impartial snort 
var rulesetName = "Either-Color Snort";
var rulesetInfoHref = null;
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("?");
var computationalComplexity = toNode("In PSPACE");
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addVariant(variant);

 
///////////////////////// 
//Sprouts
var rulesetName = "Sprouts";
var rulesetInfoHref = "http://en.wikipedia.org/wiki/Sprouts_%28game%29";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createDocumentFragment();
winnerFromStart.appendChild(createTextLink("Conjecture", "http://www.cs.cmu.edu/~sleator/papers/Sprouts.htm"));
winnerFromStart.appendChild(document.createTextNode(": (with n points)"));
winnerFromStart.appendChild(document.createElement("br"));
winnerFromStart.appendChild(document.createTextNode("Previous Player: n mod 6 = 0, 1, or 2"));
winnerFromStart.appendChild(document.createElement("br"));
winnerFromStart.appendChild(document.createTextNode("First Player: n mod 6 = 3, 4, or 5"));

var computationalComplexity = document.createTextNode("In PSPACE");
var otherProperties = document.createTextNode(" ");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.setImage("http://www.wired.com/wp-content/uploads/blogs/geekdad/wp-content/uploads/2010/10/Sprouts.jpg");

properties.addPlayableLink("http://www.math.utah.edu/~alfeld/Sprouts/", "Java");

properties.addBlogLink("http://combinatorialgametheory.blogspot.com/2010/01/game-description-sprouts.html");

rulesetPropertiesList.push(properties);

//Sprouts variant: Brussels Sprouts 
var rulesetName = "Brussels Sprouts";
var rulesetInfoHref = "http://en.wikipedia.org/wiki/Sprouts_%28game%29#Brussels_Sprouts";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createDocumentFragment();
winnerFromStart.appendChild(document.createTextNode("Odd crosses: First Player"));
winnerFromStart.appendChild(document.createElement("br"));
winnerFromStart.appendChild(document.createTextNode("Even crosses: Second Player"));
var computationalComplexity = document.createTextNode("In P");
var otherProperties = document.createTextNode("Value is always either 0 or *.");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addVariant(variant);




 
///////////////////////// 
//Subtraction Game
var rulesetName = "Subtraction (Game)";
var rulesetInfoHref = "https://en.wikipedia.org/wiki/Subtraction_game";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = "Either player";
var computationalComplexity = createLink("Single pile of n's outcome class is in O(n log^2(n), which is polynomial in n, and exponential in the bit-complexity.", "https://doi.org/10.4230%2Flipics.fun.2018.20");
var otherProperties = "";
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addAlias("Take Away");
properties.addAlias("Nim (one pile)");

properties.addBriefDescription("Played on a pile of tokens and a \"subtraction set\" of numbers.  Each turn consists of selecting one of the numbers in the set and removing that many tokens from the pile.");

rulesetPropertiesList.push(properties);


//variants

//Subtraction variant: Fibonacci Nim 
var rulesetName = "Fibonacci Nim";
var rulesetInfoHref = "https://en.wikipedia.org/wiki/Fibonacci_nim";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = "Depends on the Zeckendorf representation of the current number.  Best move is to take the smallest number in the representation.  (I don't recall exactly when you lose.)";
var computationalComplexity = "? How long does it take to find the Zeckendorf representation?";
var otherProperties = "";

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addBriefDescription("Each turn, the subtraction set is {1, 2, ..., 2k} where the last player took k.  (The first turn can take any number aside from all.)");

properties.addVariant(variant);


//Subtraction variant: Partisan Subtraction Game
var rulesetName = "Partisan Subtraction (Game)";
var rulesetInfoHref = "https://arxiv.org/abs/2101.01595";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = "Varies";
var computationalComplexity = createLink("NP-hard", "https://arxiv.org/abs/2101.01595");;
var otherProperties = "";

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addBriefDescription("Subtraction where each player has their own subtraction set.");

properties.addVariant(variant);


//Subtraction variant: Subtract-a-square 
var rulesetName = "Subtract a Square";
var rulesetInfoHref = "https://en.wikipedia.org/wiki/Subtract_a_square";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = "Varies";
var computationalComplexity = "";
var otherProperties = "";

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addBriefDescription("Subtraction where the subtraction set is the set of squares, {1, 4, 9, 16, ...}.");

properties.addVariant(variant);
 


/////////////////////////
// <T>


///////////////////////////////// 
//Toads and Frogs
var rulesetName = "Toads and Frogs";
var rulesetInfoHref = "http://en.wikipedia.org/wiki/Toads_and_Frogs_%28game%29";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("No standard starting positions.");
var computationalComplexity = createTextLink("PSPACE-complete", "http://compgeom.cs.uiuc.edu/~jeffe/pubs/toads.html");
var otherProperties = document.createTextNode(" ");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addBriefDescription("Left moves one toad from left-to-right, Right moves one frog right-to-left.  Each move is either one space if it's empty, or you can jump over one other opponent amphibian if the space behind it's empty.");

properties.setImage("http://simomaths.files.wordpress.com/2012/08/toadsfrogs02.png?w=640");

properties.addBlogLink("http://combinatorialgametheory.blogspot.com/2010/10/game-description-toads-and-frogs.html");

rulesetPropertiesList.push(properties);

//Toads and Frogs variant: Elephants and Rhinos 
var rulesetName = "Elephants and Rhinos";
var rulesetInfoHref = null;
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("?");
var computationalComplexity = unpublished("In P");
var otherProperties = document.createTextNode(" ");

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addBriefDescription("Just like Toads and Frogs (but with Elephants and Rhinos) except that no jumps are allowed.");

properties.addVariant(variant);
 
/////////////////////////// 
//Toppling Dominoes
var rulesetName = "Toppling Dominoes";
var rulesetInfoHref = null;
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("?");
var computationalComplexity = document.createTextNode("In PSPACE");
var otherProperties = document.createTextNode(" ");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.setImage("http://simomaths.files.wordpress.com/2012/08/dominorow211.png");

properties.addBlogLink("http://combinatorialgametheory.blogspot.com/2010/10/game-description-toads-and-frogs.html");

rulesetPropertiesList.push(properties);


///////////////////
// <U>


///////////////////
// <V>
 

//////////////////// 
//Voronoi Game
var rulesetName = "Voronoi Game";
var rulesetInfoHref = "http://istarion.de/voronoi/";
var isImpartial = false;
var isShortNode = document.createTextNode("Neither short nor loopy.");
var winnerFromStart = document.createTextNode("?");
var computationalComplexity = document.createTextNode("?");
var otherProperties = document.createTextNode(" ");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.setImage("http://1.bp.blogspot.com/_nWD8gSvCXFk/SmnUpdHYR2I/AAAAAAAABYQ/jkJEUb5QY1c/s400/Dibujo5.bmp");

properties.addPlayableLink("http://istarion.de/voronoi/", "Java");

rulesetPropertiesList.push(properties);


///////////////////
// <W>
 

//////////////////// 
//Welter's Game
var rulesetName = "Welter's Game";
var rulesetInfoHref = "http://homepages.di.fc.ul.pt/~jpn/gv/weltergame.htm";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("?");
var computationalComplexity = document.createTextNode("?");
var otherProperties = document.createTextNode(" ");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

//properties.addAlias("Wythoff's Game");
//properties.addAlias("Corner the Queen");

properties.addBriefDescription("Nim where two piles can't have the same size");

//properties.setImage("http://www.gabrielnivasch.org/_/rsrc/1311597659984/fun/combinatorial-games/wythoff/queen_board.gif");

//properties.addPlayableLink("http://www.cut-the-knot.org/pythagoras/withoff.shtml", "Java");

//properties.addBlogLink("http://combinatorialgametheory.blogspot.com/2011/02/game-description-wythoffs-nimgame.html");

rulesetPropertiesList.push(properties);
 

//////////////////// 
//Wythoff's Nim
var rulesetName = "Wythoff's Nim";
var rulesetInfoHref = "http://en.wikipedia.org/wiki/Wythoff%27s_game";
var isImpartial = true;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("?");
var computationalComplexity = createTextLink("In P", "http://en.wikipedia.org/wiki/Wythoff%27s_game#Formula_for_cold_positions");
var otherProperties = document.createTextNode(" ");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addAlias("Wythoff's Game");
properties.addAlias("Corner the Queen");

properties.addBriefDescription("Two-pile Nim where players may also take the same amount of sticks from both piles.");

properties.setImage("http://www.gabrielnivasch.org/_/rsrc/1311597659984/fun/combinatorial-games/wythoff/queen_board.gif");

properties.addPlayableLink("http://www.cut-the-knot.org/pythagoras/withoff.shtml", "Java");

properties.addBlogLink("http://combinatorialgametheory.blogspot.com/2011/02/game-description-wythoffs-nimgame.html");

rulesetPropertiesList.push(properties);


///////////////////
// <X>



////////////////////////// 
//Xiangqi
var rulesetName = "Xiangqi";
var rulesetInfoHref = "https://en.wikipedia.org/wiki/Xiangqi";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(false);
var winnerFromStart = "?";
var computationalComplexity = "??";
var otherProperties = " ";
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addBriefDescription("Possibly a relative of Chess.  Pieces include elephants, cannons, and chariots."); //fill in

properties.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Xiangqi_Board.svg/218px-Xiangqi_Board.svg.png"); //fill in

properties.addAlias("Chinese Chess"); //if applicable

//properties.addPlayableLink("http://www.fwend.com/gameofcol.htm", "Java");

//properties.addBlogLink("http://combinatorialgametheory.blogspot.com/2010/02/game-description-...html");

rulesetPropertiesList.push(properties); /* */


///////////////////
// <Y>


/////////////////// 
//Yavalath
var rulesetName = "Yavalath";
var rulesetInfoHref = "http://cambolbro.com/games/yavalath/";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = document.createTextNode("?");
var computationalComplexity = document.createTextNode("In PSPACE");
var otherProperties = document.createTextNode(" ");
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.setImage("http://cambolbro.com/games/yavalath/h.yav-game-c.png");

properties.addBriefDescription("Four-in-a-row wins, but can't have three-in-a-row without the fourth.");

properties.addBlogLink("http://combinatorialgametheory.blogspot.com/2014/03/game-description-yavalath.html");

rulesetPropertiesList.push(properties);

////////////////////////// 
//Yodd
var rulesetName = "Yodd";
var rulesetInfoHref = "http://www.boardgamegeek.com/boardgame/105173/yodd";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = "?";
var computationalComplexity = "In PSPACE";
var otherProperties = " ";
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addBriefDescription("Winner is the player with the least number of connected components.  Each turn add one or two pieces of either color, with the restriction that there must be a total odd number of connected components.");

properties.setImage("https://cf.geekdo-images.com/BJVAnW9Sn3uHj0XV8gbGjQ__itemrep/img/tAspUreiRwYxukChMS7O0Gg4jNs=/fit-in/246x300/filters:strip_icc()/pic1186963.jpg"); 

rulesetPropertiesList.push(properties); 


///////////////////
// <Z>



//end of rulesets





/**
 * Template for adding a new ruleset.

////////////////////////// 
//XXXXXXXX
var rulesetName = "BelugaBagel";
var rulesetInfoHref = "http://en.wikipedia.org/wiki/Domineering";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = "?";
var computationalComplexity = "In PSPACE";
var otherProperties = " ";
var properties = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

properties.addBriefDescription(" "); //fill in

properties.setImage(" "); //fill in

properties.addAlias("  "); //if applicable

properties.addPlayableLink("http://www.fwend.com/gameofcol.htm", "Java");

properties.addBlogLink("http://combinatorialgametheory.blogspot.com/2010/02/game-description-...html");

rulesetPropertiesList.push(properties); /* */

/* variant 

//XXXXXX variant:
var rulesetName = "CanineCanary";
var rulesetInfoHref = "http://en.wikipedia.org/wiki/Domineering";
var isImpartial = false;
var isShortNode = RulesetProperties.createLengthNode(true);
var winnerFromStart = "?";
var computationalComplexity = "In PSPACE";
var otherProperties = " ";

var variant = new RulesetProperties(rulesetName, rulesetInfoHref, isImpartial, isShortNode, winnerFromStart, computationalComplexity, otherProperties);

variant.addBriefDescription(" "); //fill in

variant.addAlias("  "); //if applicable

variant.addPlayableLink("http://www.cut-the-knot.org/Curriculum/Arithmetic/Kayles.shtml", "Java");

variant.addBlogLink("http://combinatorialgametheory.blogspot.com/2010/02/game-description-...html");

properties.addVariant(variant); /* */


        
function generateRulesetTablePage() {
    
    var emailNodes = document.getElementsByClassName("email");
    for (var i = 0; i < emailNodes.length; i++) {
        appendChildrenTo(emailNodes[i], ["paithanq", "@gmail.com"]);
    }
    
    var rulesets = document.getElementById("rulesetTable");
    
    //these are deprecated, but the dumb new way of doing it means adding a setting for each cell, which is super annoying.  Boo.  No sir, I don't like it.  TODO: figure out how to make this compliant
    rulesets.border = "2";
    
    for (var i = 0; i < rulesetPropertiesList.length; i++) {
        rulesetPropertiesList[i].addRowsToTable(rulesets);
    }
    
    //glossary
    /*
    document.body.appendChild(document.createElement("p"));
    document.body.lastChild.style.textAlign = "center";
    document.body.lastChild.style.fontSize = "large";
    document.body.lastChild.appendChild(document.createTextNode("Glossary of CGT Terms"));
    
    document.body.appendChild(document.createElement("p"));
    document.body.lastChild.style.textAlign = "left";
    document.body.lastChild.appendChild(document.createElement("ul"));
    document.body.lastChild.lastChild.appendChild(document.createElement("li"));
    document.body.lastChild.lastChild.lastChild.appendChild(document.createElement("b"));
    document.body.lastChild.lastChild.lastChild.lastChild.appendChild(document.createTextNode("Short"));
    document.body.lastChild.lastChild.lastChild.appendChild(document.createTextNode(": a position in a short ruleset has a game tree of finite height and width."));
    */
    
}

generateRulesetTablePage();
