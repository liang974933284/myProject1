// 获取品牌列表接口
// /admin/product/baseTrademark/{page}/{limit}
import request from '@/utils/request'
export function reqTradeMarkList(page,limit) {
	return request({
		url: `/admin/product/baseTrademark/${page}/${limit}`,
		method: 'get'
	})
}
// 处理添加品牌
// 新增品牌 /admin/product/baseTrademark/save  post 携带两个参数：品牌名称、品牌LOGO 
// 切记：对于新增的品牌，不需要传递id，由服务器生成。
// 修改品牌的信息
// 修改信息 /admin/product/baseTrademark/update put 携带三个参数：id、品牌名称、品牌LOGO
export function reqAddOrUpdateTradeMark(tradeMark) {
	if(tradeMark.id){// 有id代表修改
		return request({
			url: '/admin/product/baseTrademark/update',
			method: 'put',
			data: tradeMark
		})
	}else{// 无id代表新增
		return request({
			url: '/admin/product/baseTrademark/save',
			method: 'post',
			data: tradeMark
		})
	}
}