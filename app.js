(function(w){
	function Main(id){
		this.view=new w.app.View(id);
		this.model=new w.app.Model();
		this.controller=new w.app.Controller(this.view,this.model);
	}
	var home=new Main('#container');
})(window);