<template>
	<div id="app">
		<router-view/>
	</div>
</template>

<style lang="scss">
body,html {
	font-family: '-apple-system','Arial','Helvetica','sans-serif';
	font-size: 14px;
	height: 100%;
	margin: 0;
	padding: 0;
	line-height: 1.5;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
}
a {
	text-decoration: none;
}
ul,li {
	margin: 0;
	padding: 0;
	list-style: none;
}
.flex {
	display: -webkit-box;
	display: -webkit-flex;
	display: flex;
}
.flex-item {
	-webkit-box-flex: 1;
	-webkit-flex: 1;
	-ms-flex: 1;
	flex: 1;
	width: 1%;
	display: block;
}
.flex-vertical {
	-webkit-box-align: center;
	-webkit-align-items: center;
	-ms-flex-align: center;
	align-items: center;
}
#app {
	height: 100%;
}
</style>
