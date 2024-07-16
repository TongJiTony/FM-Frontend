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
            <el-form-item>

            </el-form-item>
        </el-form>
    </div>
</template>

<script>
//import axios from 'axios';

export default{
    data(){
        return {
            registerForm:{
                userId: '',
                userName: '',
                userRight: '',
                userPassword: '',
                userPhone: '',
                icon: '',
            },
        }
    }
}


</script>