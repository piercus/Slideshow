sand.define("Slideshow/Slideshow", ["Seed/Seed","Slideshow/Slide", "Array/each", "Array/map", "toDOM/toDOM", "Function/curry", "Function/bind"], function(r){
    
  /**
  * @Class : Slideshow 
  * Build a slideshow
  **/

  var Slideshow = r.Seed.extend({
    "+options" : {
      slides : [], // Slideshow/Slide instance, or slideshow/Slide configuration objects
      //ms duration of each slide
      duration : 3000, 
      transition : 500,
      selectedIndex : 0,
      started : null,
      parentEl : null
    },

    "+init" : function(){
      this.el = r.toDOM(this.djson(), this);

      this.parentEl && this.parentEl.appendChild(this.el);
      var i = 0;
      this.slides.each(function(s){
        this.slidesEl.appendChild(s.el);
        s.setIndex(i);
        s.setSelected(i === this.selectedIndex);
        i++;
      }.bind(this));

      this.started && this.start();
    },
    
    /**
    * @method : +setOptions 
    * Handle Slide Configuration
    **/
    
    "-setOptions" : function(o){
      if(this._o && this._o.hasOwnProperty("slides") && this._o.slides.length > 0) {
        var nSlides = [];
        this._o.slides.each(function(s){
          var slide = s.isSlide ? s : new r.Slide(s);
          nSlides.push(slide);
        });
        this._o.slides = nSlides;
      }
    },
    
    /**
    * @method : domDesc 
    * define the HTML structure
    **/    
    
    djson : function(){
      var i = 0, t = this.slides.length+1;
      return {
        tag : "div.cont",
        events : { "mouseout" : this.onOut.bind(this), "mouseover" : this.onOver.bind(this) },
        children : [{
            tag : "div.slides",
            as : "slidesEl"
          },{
            tag : "div.controls",
            children : [{
                tag : "div.previous",
                events : { "click" : this.onPrevious.bind(this)}  
            }].concat(this.slides.map(function(s){
                  var index = i++;
                  return {
                    tag : "div.control"+ (index === this.selectedIndex ? ".selected" : "" ),
                    as : "control-"+index,
                    style : { left : (index+1)/t*100+"%"},
                    events : { "click" : this.goToSlide.curry(index).bind(this)}                 
                  };
            }.bind(this))).concat([{
                  tag : "div.next",
                  events : { "click" : this.onNext.bind(this)}              
            }])
        }]
      };
    },
    
    /**
    * @method start
    */
    
    start : function(){
      if(!this.isStarted){
        this.intervalIndex = setInterval(this.onInterval.bind(this), this.duration);
      }
      this.isStarted = true;
        
    },
    
    /**
    * @method pause
    */  
      
    pause : function(){
      if(!this.intervalIndex) return;
      clearInterval(this.intervalIndex);
      this.intervalIndex = null;
      this.isStarted = false;
    },
    
    onInterval : function(){
      this.onNext();
    },
    
    goToSlide : function(index, options){
      this.slides[this.selectedIndex].moveOut(options);
      this.removeClass("selected", this["control-"+this.selectedIndex]);
      
      this.slides[index].moveIn(options);
      this.addClass("selected", this["control-"+index]);   
         
      this.selectedIndex = index;
    },
    
    onPrevious : function(){
      var newSelectedIndex = (this.selectedIndex-1+this.slides.length)%this.slides.length;  
      this.goToSlide(newSelectedIndex);
    },
    
    onNext : function(){
      var newSelectedIndex = (this.selectedIndex+1)%this.slides.length;
      this.goToSlide(newSelectedIndex, {sens : "right"});
    },
    
    hasClass : function(name, el) {
       return (new RegExp('(\\s|^)'+name+'(\\s|$)')).test((el ||this.el).className);
    },

    addClass : function(name, el){
      if (!this.hasClass(name)) { (el || this.el).className += ((el || this.el).className ? ' ' : '') +name; }
    },

    removeClass : function(name, el){
      if (this.hasClass(name, el)) {
        (el || this.el).className = (el || this.el).className.replace(new RegExp('(\\s|^)'+name+'(\\s|$)'),' ').replace(/^\s+|\s+$/g, '');
      }
    },
    
    onOver : function() {
      
      this.pause();
      this.overPaused = true;
    },
    
    onOut : function() {
      
      if(this.overPaused){
        this.start();
        this.overPaused = false;
      }
      
    }
  });
  
  return Slideshow;
});

