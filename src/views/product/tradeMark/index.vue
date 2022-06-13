<template>
	<div>
		<el-button type="primary" icon="el-icon-plus" style="margin: 10px 0px">
			添加
		</el-button>
		<el-table border>
			<el-table-column prop="" label="序号" width=""></el-table-column>
			<el-table-column prop="" label="品牌名称" width=""></el-table-column>
			<el-table-column prop="" label="品牌LOGO" width=""></el-table-column>
			<el-table-column prop="" label="操作" width=""></el-table-column>
		</el-table>
		<el-pagination 
			style="margin-top: 20px;text-align: center;" 
			background 
			:total="99" 
			:current-page="1"
			:page-sizes="[3, 5, 10]" 
			layout=" prev, pager, next, jumper, ->, total,sizes">
		</el-pagination>
	</div>
</template>
<script>
export default {
	name: 'tradeMark',
	setup() {

		return {

		}
	},
}

</script>
<style lang="scss" scoped>
</style>
