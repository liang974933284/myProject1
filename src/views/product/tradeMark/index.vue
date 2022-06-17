<template>
	<div>
		<el-button @click="showDialog" type="primary" icon="el-icon-plus" style="margin: 10px 0px 20px">
			添加
		</el-button>
		<el-table style="width: 100%;" border :data="tradeData.list">
			<el-table-column type="index" :index="indexAdd" label="序号" width=""></el-table-column>
			<el-table-column prop="tmName" label="品牌名称" width=""></el-table-column>
			<el-table-column prop="logoUrl" label="品牌LOGO" width="">
				<template v-slot="{row,$index}">
					<img :src="row.logoUrl" alt="链接被改了，图片暂时无法显示" style="width: 100px;height: 100px">
				</template>
			</el-table-column>
			<el-table-column label="操作" width="">
				<template v-slot="{row,$index}">
					<el-button type="warning" icon="el-icon-edit" @click="updateTradeMark(row)">修改</el-button>
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
		<el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible" modal>
		<!-- form表单，model属性：把表单的数据收集到那个对象身上，表单验证，也需要这个属性 -->
			<el-form style="width: 80%;" :model="tmForm" :rules="rules" ref="ruleForm">
				<el-form-item label="品牌名称" label-width="100px" prop="tmName">
					<el-input v-model="tmForm.tmName" placeholder="请输入品牌名称"></el-input>
				</el-form-item>
				<el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
					<!-- 这里不能用v-model收集数据，因为这里不是表单元素 
								action:上传图片地址
								:on-success 可以监测到图片上传成功，当图片上传成功时，会执行一次
								:before-upload 可以在上传图片之前执行一次
					-->
					<el-upload
						class="avatar-uploader"
						action="/dev-api/admin/product/fileUpload"
						:show-file-list="false"
						:on-success="handleAvatarSuccess"
  					:before-upload="beforeAvatarUpload">
						<img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
					</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
  		</div>
		</el-dialog>
	</div>
</template>
<script>
import { reactive,toRefs,getCurrentInstance, onMounted } from '@vue/composition-api'
import { validate } from 'json-schema';
import { async } from 'q';

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
			getPageList()
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
		/* 添加按钮展示dialog表单 */
		const dialogData = reactive({
			dialogFormVisible: false,
			imageUrl: '',
			// 收集品牌信息,对象身上的属性不能瞎写，需要跟后端接收对象属性名称保持一致
			tmForm: {
				tmName: '',
				logoUrl: ''
			},
			// 表单验证规则
			rules: {
				tmName: [
            { required: true, message: '请输入品牌名称', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
          ],
				logoUrl: [
					{ required: true, message: '请选择品牌图片'}
				],
			}
		})
		// 添加一个品牌
		function showDialog() {
			delete dialogData.tmForm.id
			dialogData.tmForm.tmName = ''
			dialogData.tmForm.logoUrl = ''
			dialogData.dialogFormVisible = true
		}
		// 修改一个品牌
		function updateTradeMark(row) {
			// row是当前用户选中这个品牌的信息
			// 这里扩展运算符将值赋给tmForm的对应属性
			// 如果直接写dialogData.tmForm = row 会将tmForm和row指向同一个地址，由于tmForm和页面的表单数据绑定，所以这样会变成直接同步修改表单内容（即使不点确定按钮）
			dialogData.dialogFormVisible = true
			dialogData.tmForm = {...row}
		}
		// 图片上传成功
		function handleAvatarSuccess(res, file) {
			// res是上传成功后返回前端的数据
			// res是上传成功后服务器返回前端的数据
      dialogData.tmForm.logoUrl = res.data
    }
		// 图片上传之前
		function beforeAvatarUpload(file) {
			const isJPG = file.type === 'image/jpeg';
			const isLt2M = file.size / 1024 / 1024 < 2;

			if (!isJPG) {
				this.$message.error('上传头像图片只能是 JPG 格式!');
			}
			if (!isLt2M) {
				this.$message.error('上传头像图片大小不能超过 2MB!');
			}
			return isJPG && isLt2M;
		}
		// 添加里的确定按钮（添加品牌或修改品牌）
		function addOrUpdateTradeMark() {
			proxy.$refs['ruleForm'].validate(async (valid) => {
				if (valid) {
					dialogData.dialogFormVisible = false
					// 发送请求
					let result = await proxy.$api.trademark.reqAddOrUpdateTradeMark(dialogData.tmForm)
					if(result.code === 200){
						//弹出信息
						proxy.$message(dialogData.tmForm.id?{message:'修改品牌成功',type: 'success'}:{message:'添加品牌成功',type: 'success'})
						// 如果是添加品牌信息，停留在第一页；如果是修改信息，应该停留在当前页
						getPageList(dialogData.tmForm.id?tradeData.page:1)
					}
				} else {
					console.log("error submit!!")
					return false
				}
			})
		}
		return {
			getPageList,
			tradeData,
			handleCurrentChange,
			handleSizeChange,
			indexAdd,
			...toRefs(dialogData),
			showDialog,
			updateTradeMark,
			handleAvatarSuccess,
			beforeAvatarUpload,
			addOrUpdateTradeMark
		}
	},
}

</script>
<style lang="scss">
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
