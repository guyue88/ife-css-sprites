<template>
	<div class="css-sprite">
		<h1 class="title">IFE CSS Sprites Tools</h1>
		<div class="tip">
			Upload your images. (Note: Please don’t upload huge files. That’s not the purpose of sprites technique.)
		</div>
		<div class="wrap">
			<div class="maker">
				<ul class="tabs">
					<li v-for="(tab, index) in tabs" :class="{active: tab.active}" :key="index" @click="setTab(index)">
						{{tab.title}}
					</li>
				</ul>
				<div class="area-item" v-for="(tab, index) in tabs" :class="{active: tab.active}" :key="index">
					<div class="canvas-area" v-if="tab.title === 'canvas'">
						<div class="no-image" v-show="!hasImage">
							<img src="http://s7.qhres.com/static/e9f9fdb2a8a9dbbd.svg" height="40px"/>
							<p>No images uploaded yet!</p>
							<p>
								<span class="file-wrap">
									<a class="btn choose-file" href="javascript:;">
										CHOOSE FILES
									</a>
									<input type="file" multiple="multiple" @change="chooseFile">
								</span>
							</p>
						</div>
						<div class="canvas" v-show="hasImage">
							<div class="download-wrap">
								<a :href="downloadLink" class="btn download" download="sprites.png">
									Download
								</a>
							</div>
							<canvas :width="canvasWidth + 'px'" :height="canvasHeight + 'px'" ref="canvas"></canvas>
						</div>
					</div>
					<div class="css-area" v-if="tab.title === 'css'">
						<div class="no-css" v-show="!hasImage">
							<img src="http://s8.qhres.com/static/75ce14cb53f3e5f4.svg" height="40px"/>
							<p>No css code yet!</p>
						</div>
						<div class="css-code" v-show="hasImage">
							<ul v-if="downloadLink">
								<li v-for="(item, index) in styles" :key="index" class="flex">
									<div class="flex flex-vertical icon">
										<img :src="item.img" :width="item.w" :height="item.h" alt="">
									</div>
									<div class="flex-item code">
										<pre>{{item.code}}</pre>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div class="setting">
				<h2 class="setting-title">Setting</h2>
				<ul class="setting-cont">
					<li>
						<h4>DISTANCE SETTING</h4>
						<div class="control-group">
							<label class="label">
								distance:
							</label>
							<div class="controls">
								<input type="number" v-model="distance">
							</div>
						</div>
						<div class="apply-change">
							<button class="btn set-distance" type="button" @click="reDraw">
								Apply changes
							</button>
						</div>
					</li>
					<li>
						<h4>ALIGN ELEMENT</h4>
						<div class="control-group">
							<label class="label">
								align:
							</label>
							<div class="controls">
								<button type="button" class="btn btn-group" v-for="name in typeList" :key="name" :class="{active: name === type}" @click="setType(name)">
									{{name}}
								</button>
							</div>
						</div>
						<div class="apply-change">
							<button class="btn set-distance" type="button" @click="reDraw">
								Apply changes
							</button>
						</div>
					</li>
				</ul>
				<div class="github">
					<a href="https://github.com/AspenLuoQiang/ife-css-sprites" class="btn" target="_blank">
						<span class="icon"></span>
						View On GitHub
					</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import forp from '@/vendor/utils/forp';

export default {
	name: 'CssSprite',
	data() {
		return {
			timer: null,
			tabs: [{
				title: 'canvas',
				active: true,
			}, {
				title: 'css',
				active: false,
			}],
			images: [],
			distance: 20,
			typeList: ['minimize', 'horizontal', 'vertical'],
			type: 'minimize', // 合成方式，minimize、vertical、horizontal
			canvasWidth: 640,
			canvasHeight: 350,
			downloadLink: '###',
			styles: [],
		};
	},
	computed: {
		hasImage() {
			return !!this.images.length;
		},
	},
	methods: {
		setTab(index) {
			this.tabs.forEach((item, idx) => {
				if (index === idx) {
					this.tabs[idx].active = true;
				} else {
					this.tabs[idx].active = false;
				}
			});
		},
		chooseFile($event) {
			const fileList = $event.target.files;
			const result = [].map.call(fileList, this.readFile);
			Promise.all(result).then(data => this.loadImages(data)).then((data) => {
				this.images = data;
				this.draw(data, this.distance - 0, this.type);
			});
		},
		/* 读取文件信息，并转化为base64路径 */
		readFile(file) {
			return new Promise((resolve) => {
				const fileinfo = file.name.split('.');
				const info = {
					name: fileinfo[0],
					ext: fileinfo[1],
					type: file.type,
				};
				if (/\.(jpe?g|png)$/i.test(file.name)) {
					const reader = new FileReader();

					reader.addEventListener('load', (data) => {
						const { target } = data;
						const url = target.result;
						info.url = url;
						resolve(info);
					}, false);

					reader.readAsDataURL(file);
				}
			});
		},
		/* 加载图片，以便canvas绘制使用 */
		loadImages(images) {
			return Promise.all(images.map(info => new Promise((resolve) => {
				const image = new Image();
				image.onload = (img) => {
					const elem = img.target;
					info.elem = elem;
					info.width = elem.width;
					info.height = elem.height;
					resolve(info);
				};
				image.src = info.url;
			})));
		},
		/* 计算位置 */
		caculatePosition(images, distance, type) {
			if (type === 'minimize') {
				const listM = images.map(item => [item.width, item.height]);
				return forp(listM, distance);
			} else if (type === 'horizontal') {
				let startX = 0;
				const startY = 0;
				let height = 0;
				let width = 0;
				const listH = images.map((item, index) => {
					const res = {
						x: startX,
						y: startY,
						p: index,
					};
					height = item.height > height ? item.height : height;
					width += item.width + distance;
					startX += item.width + distance;
					return res;
				});
				width -= distance;
				return {
					w: width,
					h: height,
					l: listH,
				};
			} else if (type === 'vertical') {
				const x = 0;
				let y = 0;
				let h = 0;
				let w = 0;
				const listV = images.map((item, index) => {
					const res = {
						x,
						y,
						p: index,
					};
					w = item.width > w ? item.width : w;
					h += item.height + distance;
					y += item.height + distance;
					return res;
				});
				h -= distance;
				return {
					w,
					h,
					l: listV,
				};
			}
			return null;
		},
		/* 开始绘制 */
		draw(images, distance, type) {
			const result = this.caculatePosition(images, distance, type);

			return new Promise((resolve) => {
				this.canvasWidth = result.w;
				this.canvasHeight = result.h;
				setTimeout(() => {
					const canvas = this.$refs.canvas[0];
					const ctx = canvas.getContext('2d');
					resolve({
						ctx, images, canvas, position: result.l,
					});
				});
			}).then(({
				ctx, canvas, images, position,
			}) => {
				this.drawImages(ctx, { images, position });
				this.downloadLink = canvas.toDataURL();
				this.buildStyle(images, position);
			});
		},
		/* 将图片按照计算好的方式绘制到canvas */
		drawImages(ctx, { images, position }) {
			position.forEach((pos) => {
				const image = images[pos.p];
				ctx.drawImage(image.elem, pos.x, pos.y, image.width, image.height);
			});
		},
		/* 生成css样式 */
		buildStyle(images, position) {
			position.forEach((item) => {
				const index = item.p;
				images[index].x = item.x;
				images[index].y = item.y;
			});
			this.styles = images.map(item => ({
				w: item.width > 95 ? 95 : item.width,
				h: item.height > 95 ? 95 : item.height,
				img: item.url,
				code: `.${item.name} {
	width: ${item.width}px;
	height: ${item.height}px;
	background: url('sprites.png') -${item.x}px -${item.y}px;
}`,
			}));
		},
		/* 选择排列方式 */
		setType(type) {
			this.type = type;
		},
		reDraw() {
			if (!this.hasImage) return;
			this.draw(this.images, this.distance - 0, this.type);
		},
	},
};
</script>

<style lang="scss" scoped>
	.css-sprite{
		width: 1170px;
		margin: 0 auto;
		.btn{
			display: inline-block;
			font-size: 13px;
			padding: 8px 12px;
			border: 1px solid #19b955;
			border-radius: 3px;
			background: #19b955;
			color: #fff;
			cursor: pointer;

			&:focus,&:active{
				outline: 0;
			}
			&.large{
				padding: 12px 18px;
			}
			&.small{
				padding: 4 6px;
				font-size: 12px;
			}
		}
		.title, .tip{
			text-align: center;
		}
		.wrap{
			display: -webkit-box;
			display: -webkit-flex;
			display: flex;
			margin-top: 50px;

			.maker{
				width: 70%;
				margin-right: 20px;
			}
			.setting{
				-webkit-box-flex: 1;
				-webkit-flex: 1;
				-ms-flex: 1;
				flex: 1;
				width: 1%;
				display: block;
			}
			.tabs{
				height: 34px;
				border-bottom: 1px solid #e5e5e5;
				color: #666;
				font-size: 15px;

				li{
					min-width: 44px;
					height: 34px;
					line-height: 34px;
					text-align: center;
					border-right: 1px solid #e5e5e5;
					border-top: 1px solid #e5e5e5;
					padding: 0 20px;
					float: left;
					cursor: pointer;
					background: #f8f8f8;

					&.active{
						border-top: 2px solid #19b955;
						position: relative;
						margin: -1px 0;
						color: #19b955;
						background: #fff;
					}
					&:first-child{
						border-left: 1px solid #e5e5e5;
					}
				}
			}
			.area-item{
				display: none;
				margin-top: 15px;
				border: 1px solid #e5e5e5;
				padding: 15px;
				min-height: 500px;
				position: relative;
				overflow: auto;

				&.active{
					display: block;
				}
				.no-image, .no-css{
					position: absolute;
					top: 50%;
					left: 50%;
					text-align: center;
					transform: translate(-50%, -50%);
					color: #999;
					font-size: 15px;
					.file-wrap{
						display: inline-block;
						position: relative;
						overflow: hidden;
						margin-top: 2em;
						input[type='file']{
							display: block;
							width: 100%;
							height: 100%;
							position: absolute;
							left: 0;
							top: 0;
							opacity: 0;
						}
					}
				}
				.canvas{
					.download-wrap{
						text-align: center;
						margin-top: 20px;
						.download{
							font-size: 16px;
						}
					}
					canvas{
						margin-top: 50px;
						background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKAQMAAAC3/F3+AAAABlBMVEWgoKD///+BiQigAAAAEUlEQVQI12NgP8CAjH4wICMAfIMIvOGvGm0AAAAASUVORK5CYII=) repeat;
					}
				}
				.css-code{
					li{
						padding: 15px;
						border: 1px solid #ccc;
						background-color: #f8f8f8;
						border-radius: 3px;
					}
					li + li{
						margin-top: 15px;
					}
					.icon{
						margin-right: 12px;
						width: 95px;
						height: 95px;
						overflow: hidden;
					}
					pre{
						margin: 0;
						overflow: auto;
						padding: 0;
						line-height: 1.4;
					}
				}
			}
		}
		.setting{
			background-color: #f8f8f8;
			border-radius: 3px;
			padding: 15px;

			.setting-title{
				padding: 0;
				margin: 0;
			}
			.setting-cont{
				margin-top: 10px;
				li{
					padding: 25px 0;
				}
				li + li{
					border-top: 1px solid #ccc;
				}
				h4{
					margin: 0 0 25px;
				}
			}
			.control-group{
				display: -webkit-box;
				display: -ms-flexbox;
				display: flex;
				.label{
					width: 20%;
					margin-right: 12px;
					text-align: right;
					line-height: 34px;
				}
				.controls{
					-webkit-box-flex: 1;
					-ms-flex: 1;
					flex: 1;
					width: 1%;
					line-height: 34px;
				}
				.btn-group{
					padding: 8px;
					&.active, &:hover{
						background-color: #158e43;
						border-color: #158e43;
					}
				}
				.btn-group:first-child{
					border-radius: 3px 0 0 3px;
				}
				.btn-group + .btn-group{
					border-radius: 0;
					border-left-color: #ccc;
					margin-left: -1px;
				}
				.btn-group:last-child{
					border-radius: 0 3px 3px 0;
				}
				.btn-group:focus{
					outline: 0;
				}
				input{
					display: inline-block;
					width: 150px;
					height: 18px;
					padding: 4px;
					font-size: 13px;
					line-height: 18px;
					color: #555;
					background-color: #fff;
					border: 1px solid #ccc;
					-webkit-border-radius: 3px;
					-moz-border-radius: 3px;
					border-radius: 3px;
				}
			}

			.apply-change{
				margin-top: 30px;
				text-align: center;
				.set-distance{
					color: #19b955;
					background-color: #fff;
				}
			}
		}
		.github{
			margin-top: 60px;
			text-align: center;
			a{
				background-color: #fff;
				border: 1px solid #ccc;
				border-radius: 3px;
				color: #333;
			}
			.icon{
				display: inline-block;
				vertical-align: -5px;
				width: 16px;
				height: 16px;
				background: url(http://p3.qhimg.com/t0167c2250d8178548f.png) no-repeat 0px -15px;
				background-size: cover;
			}
		}
	}
</style>
