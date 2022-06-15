<template>
	<div>
		<el-button type="primary" icon="el-icon-plus" style="margin: 10px 0px">
			添加
		</el-button>
		<el-table style="width: 100%;" border :data="tradeData.list">
			<el-table-column type="index" :index="indexAdd" label="序号" width=""></el-table-column>
			<el-table-column prop="tmName" label="品牌名称" width=""></el-table-column>
			<el-table-column prop="logoUrl" label="品牌LOGO" width="">
				<template v-slot="{row,$index}">
					<img src="row.logoUrl" alt="链接被改了，图片暂时无法显示" style="width: 100px;height: 100px">
				</template>
			</el-table-column>
			<el-table-column label="操作" width="">
				<template v-slot="{row,$index}">
					<el-button type="warning" icon="el-icon-edit">修改</el-button>
					<el-button type="danger" icon="el-icon-delete">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination 
			style="margin-top: 20px;text-align: center;" 
			background 
			:total="tradeData.total" 
			:current-page="tradeData.page"
			:page-size="tradeData.limit"
			:page-sizes="[3, 5, 10]" 
			layout=" prev, pager, next, jumper, ->, total,sizes"
			@current-change="handleCurrentChange"
			@size-change="handleSizeChange"
			>
		</el-pagination>
		<el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
			<el-form>
				<el-form-item label="品牌名称" label-width="100px">
					<el-input placeholder="请输入品牌名称"></el-input>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>
<script>
import { reactive,toRefs,getCurrentInstance, onMounted } from '@vue/composition-api'

export default {
	name: 'tradeMark',
	setup() {
		const {proxy} = getCurrentInstance();
		/* 获取品牌管理的列表数据 */
		const tradeData = reactive({
			page: 1,// 当前页码
			limit: 5,// 每页展示数据条数
			total: 0,// 总共数据条数
			list: []// 列表展示的数据
		})
		onMounted(() => {
			getPageList();
		})
		//获取品牌列表数据
		async function getPageList() {
			const {page,limit} = tradeData
			let result = await proxy.$api.trademark.reqTradeMarkList(page,limit)
			if(result.code === 200) {
				tradeData.total = result.data.total
				tradeData.list = result.data.records
			}
		}
		// 当前页码变化时展示数据
		function handleCurrentChange(pager) {
			tradeData.page = pager
			getPageList()
		}
		// 调节每页显示几条数据时，列表展示对应条数的数据
		function handleSizeChange(limit) {
			tradeData.limit = limit
			getPageList()
		}
		// 表格序号累加
		function indexAdd(index) {
			const page = tradeData.page
			const pageSize = tradeData.limit
			return (page - 1) * pageSize + index + 1
		}
		const dialogData = reactive({
			dialogFormVisible: false
		})
		return {
			getPageList,
			tradeData,
			handleCurrentChange,
			handleSizeChange,
			indexAdd,
			...toRefs(dialogData)
		}
	},
}

</script>
<style lang="scss" scoped>
</style>
