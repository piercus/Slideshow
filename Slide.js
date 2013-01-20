sand.define("Slideshow/Slide", ["Seed/Seed", "jQuery->jQ", "toDOM/toDOM", "Function/bind", "core/extend"], function(r){

  var Slide = r.Seed.extend({
    options : {
      title : "a title",
      subtitle : "default subTitle",
      image : false,
      moreLink : "#",
      linkMoreLabel : "En savoir plus ...",
      index : null,
      selected : false,
      width : 560,
      color : "#939393"
    },
    
    "+init" : function(){
      this.el = r.toDOM(this.djson(), this);
    },
    
    djson : function(){
      return {
        tag : "slide",
        style : this.image ? { backgroundImage : "url("+this.image+")" } : {},
        children : [{
            tag : "div.table", 
            children : [{ 
                tag : "div.line", 
                children : [{
                    tag : "div.left-column",
                    style : {backgroundColor : this.color},
                    children : [{
                        tag : "h1",
                        innerHTML : this.title
                      },{
                        tag : "div.subtitles",
                        innerHTML : this.subtitle,
                        style : ((navigator.appCodeName.indexOf("Mozilla")!=-1 && navigator.userAgent.indexOf("AppleWebKit")==-1) ? {"fontSize" : "11px"} : {})
                      },{
                        tag : "a.moreLink",
                        attr : { href : this.moreLink || "#"},
                        style : {color : this.color, display: "block", backgroundColor : "white", padding: "3px",  margin: "0px 20px", "textAlign": "center", "fontSize" : "12px" },
                        innerHTML : this.linkMoreLabel
                      }]
                  },
                  "td.empty-column"
                ]
            }]
        }]
      }
    },

    /**
    * @method setSelected
    * @argument {boolean} bool set selected or not ?
    * Used by the slideshow to set the index of the slide
    */
    
    setSelected : function(bool){
      if(this.selected !== bool) {
        (bool ? this.addClass("selected") : this.removeClass("selected"));
        this.selected = bool;
      }
    },
        
    /**
    * @method setIndex
    * @argument {number} i the index to set
    * Used by the slideshow to set the index of the slide
    */
    
    setIndex : function(i){
      if(typeof(this.index) === "number"){
        this.replaceClass("index-"+this.index, "index-"+i)
      } else {
        this.addClass("index-"+i);
      }
      this.index = i;
    },
    
    /**
    * @method moveIn
    * @argument {object} options contains transition, sens properties
    * Used by the slideshow to move the slide In
    */  
      
    moveIn : function(options){
      this.move(r.extend({}, options || {}, {moveIn : true}));
    },
    
    move : function(options){
      var transition = options.transition || 500,
          sens = options.sens || "left",
          anim = {},
          moveIn = options.moveIn,
          width = options.width || this.width,
          leftEnd = moveIn ? 0 : (sens === "left" ? 1 : -1)*width,
          leftStart = !moveIn ? 0 : (sens === "left" ? -1 : 1)*width;
     
          
      this.el.style["left"] =  leftStart+"px"; 
           
      moveIn && this.setSelected(true);
      
      anim["left"] = leftEnd;
      
      r.jQ(this.el).animate(anim, transition, function(){
        moveIn || (this.setSelected(false),(this.el.style[sens] =  "-"+width+"px"));
      }.bind(this));    
    },

    /**
    * @method moveOut
    * @argument {number} transition the transition in ms
    * Used by the slideshow to move the slide out
    */  
    
    moveOut : function(options){
      this.move(r.extend({}, options || {}));
    },
    
    hasClass : function(name) {
       return (new RegExp('(\\s|^)'+name+'(\\s|$)')).test(this.el.className);
    },

    addClass : function(name){
      if (!this.hasClass(name)) { this.el.className += (this.el.className ? ' ' : '') +name; }
    },

    removeClass : function(name){
      if (this.hasClass(name)) {
        this.el.className = this.el.className.replace(new RegExp('(\\s|^)'+name+'(\\s|$)'),' ').replace(/^\s+|\s+$/g, '');
      }
    }

    
  });
  
  return Slide;
});
