// 获取品牌列表接口
// /admin/product/baseTrademark/{page}/{limit}
import request from '@/utils/request'
export function reqTradeMarkList(page,limit) {
	return request({
		url: `/admin/product/baseTrademark/${page}/${limit}`,
		method: 'get'
	})
}