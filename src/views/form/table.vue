<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>栏目</span>
              </div>
              <el-tree :props="tree_props" :data="tree_data" default-expand-all />
            </el-card>
          </el-col>
          <el-col :span="20">
            <el-card class="box-card">
              <!-- 快速搜索 -->
              <div slot="header" class="clearfix">
                <span>快速搜索</span>
              </div>
              <el-row :gutter="20">
                <el-col :span="24">
                  <div class="postInfo-container">
                    <el-row>
                      <el-col :span="5">
                        <el-form-item
                          label-width="90px"
                          label="标题:"
                          class="postInfo-container-item"
                        >
                          <el-input v-model="title_value" placeholder="请输入内容" clearable />
                        </el-form-item>
                      </el-col>
                      <el-col :span="5">
                        <el-form-item
                          label-width="90px"
                          label="是否收费:"
                          class="postInfo-container-item"
                        >
                          <el-select v-model="select_value1" placeholder="请选择">
                            <el-option
                              v-for="item in select_options1"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="5">
                        <el-form-item
                          label-width="90px"
                          label="状态:"
                          class="postInfo-container-item"
                        >
                          <el-select v-model="select_value2" placeholder="请选择">
                            <el-option
                              v-for="item in select_options2"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item
                          label-width="90px"
                          label="收费模式:"
                          class="postInfo-container-item"
                        >
                          <el-select v-model="select_value3" placeholder="请选择">
                            <el-option
                              v-for="item in select_options3"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="2" :offset="1">
                        <el-button type="primary">搜索</el-button>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
            </el-card>
            <el-card class="box-card" style="margin-top:20px">
              <div slot="header" class="clearfix">
                <span>列表</span>
              </div>
              <div class="table_btn">
                <el-button type="primary" @click="handleCreate">新增</el-button>
                <el-button type="primary" @click="getList">刷新</el-button>
                <el-button type="primary" @click="handleDownload">导出</el-button>
                <el-select
                  v-model="table_column_value"
                  multiple
                  collapse-tags
                  style="margin-left: 20px;"
                  placeholder="请选择"
                  @change="handleTableColumn"
                >
                  <el-option
                    v-for="item in table_column_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <!-- 表格 -->
              <el-table
                :key="tableKey"
                v-loading="listLoading"
                :data="list"
                border
                fit
                highlight-current-row
                style="width: 100%;"
                :default-sort="{prop: 'timestamp', order: 'descending'}"
              >
                <el-table-column type="selection" align="center" width="50" />
                <el-table-column label="封面" prop="remark" align="center">
                  <template slot-scope="scope">
                    <div>
                      <img
                        style="width:50px;height:50px;display:inline-block"
                        src="https://storeauth.tartopia.cn/o_1dbkifsihr0k1d0q1j2r1j6f5pfg.jpg"
                      >
                    </div>
                    <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="费用" prop="pageviews" align="center" sortable>
                  <template slot-scope="{row}">
                    <template v-if="row.edit">
                      <el-input v-model="row.pageviews" style="margin-bottom:10px" size="small" />
                      <el-button
                        type="success"
                        size="small"
                        icon="el-icon-circle-check-outline"
                        @click="confirmEdit(row)"
                      >Ok</el-button>
                      <el-button
                        class="cancel-btn"
                        size="small"
                        icon="el-icon-refresh"
                        type="warning"
                        @click="cancelEdit(row)"
                      >cancel</el-button>
                    </template>
                    <span v-else class="link-type" @click="row.edit=!row.edit">{{ row.pageviews }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="开课时间" prop="timestamp" align="center" sortable>
                  <template slot-scope="scope">
                    <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d}') }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="!!table_column_value&&(table_column_value.indexOf('选项1')>-1)"
                  label="列111"
                  align="center"
                >
                  <span>列111列111列111列111列111列111</span>
                </el-table-column>
                <el-table-column
                  v-if="!!table_column_value&&(table_column_value.indexOf('选项2')>-1)"
                  label="列222"
                  align="center"
                >
                  <span>列222列222列222列222列222列222列222</span>
                </el-table-column>
                <el-table-column label="状态" align="center">
                  <template slot-scope="{row}">
                    <el-tooltip
                      :content="'状态: ' + (row.status==='published'?'已发布':'未发布')"
                      placement="top"
                    >
                      <el-switch
                        v-model="row.status"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-value="published"
                        inactive-value="draft"
                        @change="switchChange"
                      />
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$t('table.actions')"
                  align="center"
                  class-name="small-padding fixed-width"
                >
                  <template slot-scope="{row}">
                    <el-button type="primary" @click="handleUpdate(row)">编辑</el-button>
                    <el-button type="danger" @click="handleDelete(row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 分页 -->
              <pagination
                v-show="total>0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                @pagination="getList"
              />
              <!-- 弹框 -->
              <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
                <el-form
                  ref="dataForm"
                  :rules="rules"
                  :model="temp"
                  label-position="left"
                  label-width="70px"
                  style="width: 400px; margin-left:50px;"
                >
                  <el-form-item :label="$t('table.date')" prop="timestamp">
                    <el-date-picker
                      v-model="temp.timestamp"
                      type="datetime"
                      placeholder="Please pick a date"
                    />
                  </el-form-item>
                  <el-form-item label="费用" prop="pageviews">
                    <el-input v-model="temp.pageviews" />
                  </el-form-item>
                  <el-form-item :label="$t('table.status')">
                    <el-select
                      v-model="temp.status"
                      class="filter-item"
                      placeholder="Please select"
                    >
                      <el-option
                        v-for="item in statusOptions"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
                  <el-button
                    type="primary"
                    @click="dialogStatus==='create'?createData():updateData()"
                  >{{ $t('table.confirm') }}</el-button>
                </div>
              </el-dialog>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import { fetchList, createArticle, updateArticle } from '@/api/article';
import { parseTime } from '@/utils';
import Pagination from '@/components/Pagination';

const defaultForm = {};

export default {
  name: 'Form',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info'
      };
      return statusMap[status];
    }
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      tempRoute: {},
      tree_props: {
        label: 'name',
        children: 'children',
        isLeaf: 'leaf'
      },
      tree_data: [
        {
          name: '全部',
          children: [
            {
              name: '城市故事',
              leaf: true
            },
            {
              name: '名家专栏',
              leaf: true
            },
            {
              name: '盛典',
              leaf: true
            },
            {
              name: '工坊',
              leaf: true
            },
            {
              name: '文汇',
              children: [
                { name: '设计之美' },
                { name: '专业分享' },
                { name: '文化艺术' },
                { name: '城市杂谈' }
              ]
            },
            {
              name: '校园招聘',
              leaf: true
            },
            {
              name: '关于我们',
              leaf: true
            }
          ]
        }
      ],
      select_options1: [
        {
          value: '收费',
          label: '收费'
        },
        {
          value: '免费',
          label: '免费'
        }
      ],
      select_options2: [
        {
          value: '已上架',
          label: '已上架'
        },
        {
          value: '已下架',
          label: '已下架'
        }
      ],
      select_options3: [
        {
          value: '免费',
          label: '免费'
        },
        {
          value: '阶梯',
          label: '阶梯'
        },
        {
          value: '固定价格并且需要开通VIP',
          label: '固定价格并且需要开通VIP'
        },
        {
          value: '固定价格',
          label: '固定价格'
        },
        {
          value: 'VIP',
          label: 'VIP'
        }
      ],
      select_value1: '',
      select_value2: '',
      select_value3: '',
      title_value: '',
      // 表格
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        type: ''
      },
      statusOptions: ['published', 'draft'],
      temp: {
        id: undefined,
        remark: '',
        timestamp: new Date(),
        pageviews: '',
        originalPageviews: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      rules: {
        timestamp: [
          {
            type: 'date',
            required: true,
            message: 'timestamp is required',
            trigger: 'change'
          }
        ],
        pageviews: [
          { required: true, message: 'pageviews is required', trigger: 'blur' }
        ]
      },
      downloadLoading: false,
      table_column_options: [
        {
          value: '选项1',
          label: '列111'
        },
        {
          value: '选项2',
          label: '列222'
        }
      ],
      table_column_value: []
    };
  },
  computed: {
    lang() {
      return this.$store.getters.language;
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id;
      this.fetchData(id);
    } else {
      this.postForm = Object.assign({}, defaultForm);
    }
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route);

    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        // console.log('response:', response);
        const items = response.data.items;
        this.list = items.map(v => {
          this.$set(v, 'edit', false); // https://vuejs.org/v2/guide/reactivity.html
          v.originalPageviews = v.pageviews; //  will be used when user click the cancel botton
          return v;
        });
        this.total = response.data.total;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        remark: '',
        timestamp: new Date(),
        pageviews: '',
        originalPageviews: '',
        status: 'published'
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
          this.temp.author = 'vue-element-admin';
          createArticle(this.temp).then(() => {
            this.temp.originalPageviews = this.temp.pageviews;
            this.temp.edit = false;
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            });
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = 'update';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v);
                this.list.splice(index, 1, this.temp);
                break;
              }
            }
            this.dialogFormVisible = false;
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            });
          });
        }
      });
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      });
      const index = this.list.indexOf(row);
      this.list.splice(index, 1);
    },
    handleDownload() {
      this.downloadLoading = true;
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'pageviews', 'status'];
        const filterVal = ['timestamp', 'pageviews', 'status'];
        const data = this.formatJson(filterVal, this.list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    switchChange(curValue) {
      console.log('switchChange', curValue);
    },
    cancelEdit(row) {
      console.log('cancelEdit', row);
      row.pageviews = row.originalPageviews;
      row.edit = false;
      this.$message({
        message: '取消成功',
        type: 'warning'
      });
    },
    confirmEdit(row) {
      console.log('confirmEdit', row);
      row.edit = false;
      row.originalPageviews = row.pageviews;
      this.$message({
        message: '编辑成功',
        type: 'success'
      });
    },
    handleTableColumn(curValue) {
      '';
      console.log('handleTableColumn', curValue);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}

.table_btn {
  margin-bottom: 20px;
}
</style>
