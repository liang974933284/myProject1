// 将四个请求的模块接口统一引入
import * as trademark from './product/tradeMark';
import * as attr from './product/attr';
import * as sku from './product/sku';
import * as spu from './product/spu';

export default {
	trademark,
	attr,
	sku,
	spu
}
