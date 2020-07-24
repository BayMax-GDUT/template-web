<template>
  <div>
    <Row>
      <Col span="24" style="padding-left: 10px">
        <Card shadow>
          <div class="right">
            <Menu mode="horizontal" :theme="theme" :active-name="menuName" @on-select="handleClick">
              <MenuItem name="1">
                <Icon type="ios-person" />基本信息
              </MenuItem>
              <MenuItem name="2">
                <Icon type="md-lock" />修改密码
              </MenuItem>
              <MenuItem v-if="organizationForm.id" name="3">
                <Icon type="logo-codepen" />修改 LOGO
              </MenuItem>
            </Menu>
            <div class="form">
              <div v-if="menuName==='1'">
                <Row>
                  <Col span="4">
                    <div style="margin-left: 60px" id="iconModule">
                      <div id="iconImg">
                        <img :src="formValidate.icon || $config.userAvatar" class="icon1" />
                      </div>
                      <br />
                      <div id="iconButton">
                        <Button
                          icon="md-camera"
                          @click="setCropper"
                        >上传头像</Button>
                      </div>
                    </div>
                  </Col>
                  <Col span="20">
                    <Form
                      ref="formValidate"
                      :model="formValidate"
                      :rules="ruleValidate"
                      :label-width="100"
                      class="formInfo"
                    >
                      <FormItem label="账号">
                        <Input v-model="formValidate.accountCode" disabled />
                      </FormItem>
                      <FormItem label="姓名" prop="name">
                        <Input v-model="formValidate.name" placeholder="请输入姓名" />
                      </FormItem>
                      <FormItem label="别名">
                        <Input v-model="formValidate.alias" placeholder="请输入别名" />
                      </FormItem>
                      <FormItem label="性别" prop="sex">
                        <RadioGroup v-model="formValidate.sex">
                          <Radio v-for="val in sex" :label="val.value" :key="val.value">
                            <span>{{val.name}}</span>
                          </Radio>
                        </RadioGroup>
                      </FormItem>
                      <FormItem label="手机号码">
                        <Input v-model="formValidate.phone" disabled placeholder="请输入手机号码" />
                      </FormItem>
                      <FormItem label="个人邮箱" prop="email">
                        <Input v-model="formValidate.email" placeholder="请输入个人邮箱" />
                      </FormItem>
                      <FormItem label="部门">
                        <Input v-model="formValidate.deptNames" disabled />
                      </FormItem>
                      <FormItem label="职务">
                        <Input v-model="formValidate.post" disabled />
                      </FormItem>
                    </Form>
                    <div align="center">
                      <Button type="primary" @click="handleSubmit">保存</Button>
                    </div>
                  </Col>
                </Row>
              </div>
              <div v-else-if="menuName==='2'">
                <Form
                  ref="formData"
                  :model="formData"
                  :rules="passwordRuleValidate"
                  :label-width="100"
                  class="formPassword"
                >
                  <FormItem label="旧密码" prop="currentPassword">
                    <Input
                      type="password"
                      v-model="formData.currentPassword"
                      autocomplete="new-password"
                      placeholder="请输入旧密码"
                    />
                  </FormItem>
                  <FormItem label="新密码" prop="newPassword">
                    <Input
                      type="password"
                      v-model="formData.newPassword"
                      autocomplete="new-password"
                      placeholder="请输入新密码"
                    />
                  </FormItem>
                  <FormItem label="确认密码" prop="passwordCheck">
                    <Input type="password" v-model="formData.passwordCheck" placeholder="请确认密码" />
                  </FormItem>
                </Form>
                <div align="center" style="padding-bottom:30vh">
                  <Button type="primary" @click="handleChangePwd">提交</Button>
                </div>
              </div>
              <!-- <div v-else>
                                <Row>
                                    <img :src="formValidate.icon"/>
                                </Row>
                                <Row style="margin: 10px">建议尺寸：162 * 44（px）</Row>
                                <Row>
                                    <Upload :before-upload="handleLogoUpload" accept="image/png,image/jpeg" action="//jsonplaceholder.typicode.com/posts/">
                                        <Button icon="md-photos">修改 LOGO</Button>
                                    </Upload>
                                </Row>
              </div>-->
            </div>
          </div>
        </Card>
      </Col>
    </Row>
      <cropper-img ref="cropperIcon" :title="'设置头像'" @on-crop="handleCroped"></cropper-img>
  </div>
</template>

<script>
// import Vue from 'vue'
// import store from '@/store'
import {
  informationGetByAccountCode,
  accountUpdate,
  userChangePassword
} from "@/api/sys/account";
import CropperImg from "@/components/cropper-img";
import { uploadImg } from "@/api/login";
export default {
  name: "personal",
  components: {
    CropperImg
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value !== this.formData.newPassword) {
        callback(new Error("2次密码输入不一致"));
      } else {
        callback();
      }
    };
    return {
      // 密码加密盐
      salt: "cvaiedu",
      file: null,
      theme: "light",
      menuName: "1",
      initialData: "",
      organizationForm: {
        id: "",
        logo: this.$store.state.user.logo
      },
      cardData: {
        name: ""
      },
      formValidate: {
        icon: "",
        accountCode: "",
        phone: "",
        email: "",
        deptName: "",
        alias: "",
        name: "",
        sex: "",
        post: ""
      },
      formData: {
        id: "",
        currentPassword: "",
        newPassword: ""
      },
      ruleValidate: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        email: [{ type: "email", message: "邮箱格式不正确", trigger: "blur" }]
      },
      passwordRuleValidate: {
        currentPassword: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ],
        passwordCheck: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          {
            validator: validatePassword,
            message: "2次密码输入不一致",
            trigger: "blur"
          }
        ]
      },
      sex: [
        {
          name: "男",
          value: 1
        },
        {
          name: "女",
          value: 2
        }
      ]
    };
  },
  methods: {
    setCropper(){
      this.$refs.cropperIcon.setModalStatus()
    },
    handleCroped(blob) {
      const formData = new FormData();
      formData.append("file", blob);
      uploadImg(formData).then(res => {
        const { data } = res.data;
        this.formValidate.icon = data.url;
        this.$Message.success("图片上传成功");
        this.cropperModel = false;
      });
    },
    handleIconUpload(file) {
      this.file = file;
      let fileSize = this.file.size;
      // 2,621,440   2M
      if (fileSize > 1048576) {
        // 图片限制大小1MB
        this.$Message.error("图片大小最大为1MB！");
      }
      let _this = this;
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function(e) {
        // 读取到的图片base64 数据编码 将此编码字符串传给后台即可
        _this.formValidate.icon = e.target.result;
      };
      return false;
    },
    handleLogoUpload(file) {
      // new Promise((resolve, reject) => {
      //     let fileSize = file.size
      //     // 2,621,440   2M
      //     if (fileSize > 1048576) {
      //         // 图片限制大小1MB
      //         this.$Message.error('图片大小最大为1MB！')
      //     }
      //     let reader = new FileReader()
      //     reader.readAsDataURL(file)
      //     reader.onload = (e) => {
      //         // 读取到的图片base64 数据编码 将此编码字符串传给后台即可
      //         this.organizationForm.logo = e.target.result
      //         resolve()
      //     }
      // }).then(() => {
      //     postSchoolUpdate(this.organizationForm).then(res => {
      //         const { code, data: { logo } } = res.data
      //         if (code === 200000) {
      //             store.commit('setLogo', logo)
      //             this.$Message.success('更新成功')
      //         } else {
      //             this.organizationForm.logo = ''
      //         }
      //     })
      // })
      // return false
    },
    handleClick(name) {
      this.menuName = name;
    },
    getUserById(accountCode) {
      if (accountCode) {
        informationGetByAccountCode(accountCode).then(res => {
          const { code, data } = res.data;
          this.formValidate = data;
        });
      }
    },
    handleSubmit() {
      this.$refs["formValidate"].validate(valid => {
        if (valid) {
          accountUpdate(this.formValidate).then(res => {
            const { code, data } = res.data;
            if (code === 200000) {
              this.$Message.success("更新成功！");
              this.getUserById(this.accountCode);
            }
          });
        }
      });
    },
    handleChangePwd() {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          let obj = {
            newPassword: this.formData.newPassword,
            currentPassword: this.formData.currentPassword
          };
          userChangePassword(obj).then(res => {
            const { code } = res.data;
            if (code === 200000) {
              this.$Message.success("修改成功！");
              // 重置信息
              if (this.$refs["formData"]) this.$refs["formData"].resetFields();
            }
          });
        }
      });
    }
  },
  computed: {
    accountCode() {
      return this.$store.state.user.accountCode;
    }
  },
  watch: {
    accountCode() {
      this.getUserById(this.accountCode);
    }
  },
  mounted() {
    this.getUserById(this.accountCode);
  }
};
</script>

<style>
.left {
  vertical-align: top;
  position: relative;
  z-index: 100;
  padding: 10px 0;
}

.icon {
  border-radius: 50%;
  width: 72px;
}

.name {
  font-size: 20px;
  font-weight: bolder;
  margin: 8px;
}

.detail {
  padding: 16px 5px 0 5px;
}

.right {
  vertical-align: top;
  position: relative;
  z-index: 100;
}

.icon1 {
  width: 99px;
  height: 99px;
  border-radius: 4px;
}

.form {
  padding: 30px 150px 0 80px;
}
.formPassword {
  padding: 0px 150px 0 80px;
}

/*修改头像按钮样式*/
.file input {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}

#iconModule {
  text-align: center;
}

#iconButton,
#iconImg {
  display: inline-block;
}
.cropper-example {
  height: 340px;
}
</style>
