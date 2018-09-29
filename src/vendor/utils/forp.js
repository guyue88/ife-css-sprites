/**
 * 求解矩形最小面积拼接方法
 * @params list {array} 矩形列表
 */
class FORP {
	constructor(list, space) {
		space = space || 0;
		return this.run(list, space);
	}

	run(list, space) {
		let boxlist = list.map((item, index) => ({
			w: item[0] + space,
			h: item[1] + space,
			p: index,
		}));
		boxlist = FORP.sortByHeight(boxlist);
		const highestBox = boxlist[0];
		const boxHeight = highestBox.h;
		/* 如果想要得到最佳值，heightStep = 1 而且 sampleMax >= 160，但这会消耗很大性能 */
		const heightStep = 1;
		/* 样本个数 */
		const sampleMax = 100;
		const best = this.sampling({
			best: { u: 0 },
			sampleIndex: 0,
			boxlist,
			boxHeight,
			heightStep,
			sampleMax,
		});
		best.space = space;
		best.w -= space;
		best.h -= space;
		return best;
	}

	/* 采样 */
	sampling({
		best, boxlist, boxHeight, heightStep, sampleMax, sampleIndex,
	}) {
		const temp = FORP.palce(boxlist, boxHeight + heightStep * sampleIndex);
		/* console.log("样本%d: 利用率:%.3f, 宽度:%d, 高度:%d", sampleIndex, temp.u, temp.w, temp.h); */

		if (temp.u > best.u) {
			best = temp;
		}

		/* 如果利用率大于0.9或已找到最优解，立即结束 */
		if (best.u >= 0.9) {
			return best;
		}
		sampleIndex++;
		if (sampleIndex < sampleMax) {
			return this.sampling({
				best, boxlist, boxHeight, heightStep, sampleMax, sampleIndex,
			});
		}
		return best;
	}

	/* 排列矩形 */
	static palce(boxlist, height) {
		height = height || 0;
		/* 最大高度 */
		let MAXH = 0;
		/* 总面积 */
		let totalArea = 0;
		boxlist.forEach((item) => {
			totalArea += item.w * item.h;
		});
		const highestBox = boxlist[0];
		MAXH = Math.max(height, highestBox.h);
		/* 盒子容器的初始大小 */
		const box = {
			w: highestBox.w,
			h: MAXH,
		};
		/* rectInBox 是指已经在box里面的矩形集合 */
		/* 初始化第一个矩形的位置更新后的状态. (w, h, p, x, y) p是指原来数组的位置 */
		const rectInBox = [{
			w: highestBox.w,
			h: highestBox.h,
			p: highestBox.p,
			x: 0,
			y: 0,
		}];
		/* 矩形堆叠后的空余位置 */
		let temp = [];
		if (highestBox.h < box.h) {
			temp.push({
				x: 0,
				y: 0,
				w: highestBox.w,
				h: box.h - highestBox.h,
			});
		}

		/*
		* 核心算法理念：
		* 判断矩形能不能放到box的最左且最高的空余位置，如果可以就放
		* 如果不行，就放在box的右边，盒子容器宽度延长
		*/
		for (let i = 1, len = boxlist.length; i < len; i++) {
			const rect = boxlist[i];
			/* 查找可以在顶部存放新矩形的列表位置 */
			let pos = -1;
			const tempNew = [...temp];
			for (let j = 0, l = temp.length; j < l; j++) {
				const t = temp[j];
				if (rect.w <= t.w && rect.h <= t.h) {
					pos = j;
					/* 刚好放满 */
					if (rect.w === t.w && rect.h === t.h) {
						tempNew.splice(j, 1);
					} else if (rect.w === t.w) {
						/* 横向摆满 */
						const t1 = Object.assign({}, t);
						t1.y += rect.h;
						t1.h -= rect.h;
						tempNew[j] = t1;
					} else if (rect.h === t.h) {
						/* 竖向摆满 */
						const t1 = Object.assign({}, t);
						t1.x += rect.w;
						t1.w -= rect.w;
						tempNew[j] = t1;
					} else {
						tempNew.splice(j, 0, {
							x: t.x,
							y: t.y + rect.h,
							w: rect.w,
							h: box.h - t.y - rect.h,
						}, {
							x: t.x + rect.w,
							y: t.y,
							w: t.w - rect.w,
							h: t.h,
						});
					}
					break;
				}
			}

			if (pos === -1) {
				rectInBox.push({
					w: rect.w,
					h: rect.h,
					p: rect.p,
					x: box.w,
					y: 0,
				});
				if (box.h - rect.h > 0) {
					tempNew.push({
						x: box.w,
						y: rect.h,
						w: rect.w,
						h: box.h - rect.h,
					});
				}
				box.w += rect.w;
			} else {
				rectInBox.push({
					w: rect.w,
					h: rect.h,
					p: rect.p,
					x: temp[pos].x,
					y: temp[pos].y,
				});
			}
			temp = tempNew;
		}
		return {
			s: totalArea,
			w: box.w,
			h: box.h,
			l: rectInBox,
			u: +parseFloat(totalArea / (box.w * box.h)).toFixed(3),
		};
	}

	/* 使矩形从高到低排序 */
	static sortByHeight(list) {
		return list.sort((a, b) => b.h - a.h);
	}
}

/**
 * @description 最小矩形排列算法
 * @export
 * @param {array} list 类似[ [1,2], [3,4] ] 的包含矩形宽高的数组
 * @param {number} space 图片之间的间隔
 * @returns
 */
export default function forp(list, space) {
	return new FORP(list, space - 0);
}
