(function(w){
	function Main(id){
		this.view=new w.app.View(id);
		this.controller=new w.app.Controller(this.view);
	}
	var home=new Main('#container');
})(window);