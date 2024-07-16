<template>
    <div class="register-main">
        <h3 class="register-title">
            注册页面
        </h3>
        <el-form
            :model="registerForm"
            :rules="registerRule"
            ref="registerForm"
            @keyup.enter.native="registerFormSubmit()"
            status-icon="true"
            >
            <!--
            <el-form-item prop="userID">
                <el-input 
                v-model="registerForm.userId" 
                placeholder="用户ID">
                </el-input>
            </el-form-item>
            ID不需要传，后端统一分配-->
            <el-form-item label="用户姓名：" prop="userName">
                <el-input 
                v-model="registerForm.userName" 
                placeholder="用户姓名">
                </el-input>
            </el-form-item>
            <el-form-item label="用户权限：" prop="userRight">
               <el-select
               v-model="registerForm.userRight" 
                placeholder="请选择用户权限">
                    <el-option
                    v-for="item in userRights"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="用户密码：" prop="userPassword">
                <el-input 
                v-model="registerForm.userPassword" 
                placeholder="密码">
                </el-input>
            </el-form-item>
            <el-form-item  label="手机号码：" prop="userPhone">
                <el-input 
                v-model="registerForm.userPhone" 
                placeholder="手机号码">
                </el-input>
            </el-form-item>
            <el-form-item  label="头像图像：" prop="icon">
                <el-input 
                v-model="registerForm.icon" 
                placeholder="头像信息-URL">
                </el-input>
            </el-form-item>
             <el-form-item>
                <el-button type="primary" @click="registerFormSubmit()">注册</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import axios from 'axios';

export default{
    data(){
        return {
            registerForm:{
                //userId: '',
                userName: '',
                userRight: '',
                userPassword: '',
                userPhone: '',
                icon: '',
            },
            registerRule:{
                //userId: [{ required: true, message:"用户ID不可以为空", trigger:"blur"}],
                userName: [{ required: true, message:"用户姓名不可以为空", trigger:"blur"}],
                userRight: [{ required: true, message:"用户权限不可以为空", trigger:"blur"}],
                userPassword: [{ required: true, message:"密码不可以为空", trigger:"blur"}],
                userPhone: [{ required: true, message:"电话号码不可以为空", trigger:"blur"}],
                icon: [{ required: true, message:"头像信息不可以为空", trigger:"blur"}],
            },
            userRights:[
                {value:'player',label:'球员'},
                {value:'coach', label:'教练'},
                {value:'manager', label:'经理'},
            ]

        };
    },
    methods:{
        registerFormSubmit(){
            this.$refs['registerForm'].validate((valid)=>{
                if(valid){
                    axios
                        .post("/api/v1/user/add",{
                            //userId:this.registerForm.userId,
                            userName:this.registerForm.userName,
                            userRight:this.registerForm.userRight,
                            userPassword:this.registerForm.userPassword,
                            userPhone:this.registerForm.userPhone,
                            icon:this.registerForm.icon,
                        })
                        .then(({data})=>{
                            console.log('进入data');
                            console.log("data.code=", data.code);
                            console.log("data.msg=", data.msg);
                            
                            if(data.code==200){
                                console.log('注册成功');
                                console.log("data.id=", data.userId);
                                this.$router.replace({ name: "Login" }); // 跳转到登录界面
                            }
                            else if(data.code==500){
                                console.log('注册失败');
                            }
                        })
                        .catch(error => {
                            console.log('注册失败',error);
                            this.$message.error("注册错误，请重试");
                        });
                }
            });
        }
    }
};


</script>

<style scoped>
.register-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 20px;
}

.register-main {
    max-width: 400px;
}

.register-title {
    text-align: center;
    margin-bottom: 20px;
}

.input-field {
    width: 300px;
}

.register-image {
    margin-left: 20px;
}

.register-image img {
    max-width: 400px;
    max-height: 600px;
}
</style>