<template>
  <div class="page">
    <header-title></header-title>
    <div id="main">
      <div class="datas">
        <span>共需兑换地址：{{ infos.source_address_cnt }}</span>
        <span>共需兑换数量：{{ infos.source_value }}</span>
        <span>已兑换地址：{{ infos.target_address_cnt }}</span>
        <span>已兑换数量：{{ infos.target_value }}</span>
        <span>待兑换数量：{{ infos.done_source_value }}</span>
        <span>黑名单数量：{{ infos.disable_address_cnt }}</span>
      </div>
      <div class="table">
        <div class="toolbar">
          <div class="left">
            <div class="select">
              <span>ETH地址：</span>
              <div class="ipt">
                <el-input v-model="ethAddress" placeholder="请输入"></el-input>
              </div>
            </div>
            <div class="select">
              <span>BSC地址：</span>
              <div class="ipt">
                <el-input v-model="bscAddress" placeholder="请输入"></el-input>
              </div>
            </div>
            <div class="btn">
              <el-button @click="search" type="primary">查询</el-button>
              <el-button @click="reset">重置</el-button>
            </div>
          </div>
          <div class="box">
            <div class="btn">
              <el-button @click="allExchangeFlag = true" type="primary"
                >全兑换</el-button
              >
              <el-button @click="allAirdropFlag = true">全空投</el-button>
            </div>
            <div class="btn">
              <el-button @click="batchChangeFlag = true" type="primary"
                >批量兑换</el-button
              >
              <el-button @click="batchAirdropFlag = true">批量空投</el-button>
            </div>
          </div>
        </div>
        <div class="exchange">
          <div class="btn">
            <el-button @click="deployFlag = true" type="primary"
              >部署合约</el-button
            >
          </div>
          <div class="btn">
            <el-button @click="impFlag = true" type="primary"
              >导入白名单</el-button
            >
          </div>
        </div>
        <div class="content">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane class="menu-title" label="白名单" name="white">
              <el-table
                v-loading="tableLoading"
                :data="tables"
                @selection-change="selection"
                :header-cell-style="{
                  background: '#f5f5f5',
                  color: '#000',
                  borderRight: '1px solid #fff',
                  fontWeight: 'normal',
                }"
                style="width: 100%; font-size: 14px"
              >
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column label="ETH地址">
                  <template slot-scope="scope">
                    <div v-if="scope.row.source_address">
                      <el-tooltip
                        :content="scope.row.source_address"
                        placement="bottom"
                        effect="light"
                      >
                        <el-button class="normal">{{
                          scope.row.source_address.substr(0, 16) + "..."
                        }}</el-button>
                      </el-tooltip>
                    </div>
                    <div v-else>-</div>
                  </template>
                </el-table-column>
                <el-table-column label="BSC地址">
                  <template slot-scope="scope">
                    <div v-if="scope.row.target_address">
                      <el-tooltip
                        :content="scope.row.target_address"
                        placement="bottom"
                        effect="light"
                      >
                        <el-button class="normal">{{
                          scope.row.target_address.substr(0, 16) + "..."
                        }}</el-button>
                      </el-tooltip>
                    </div>
                    <div v-else>-</div>
                  </template>
                </el-table-column>
                <el-table-column
                  sortable
                  :sort-by="['source_amount']"
                  label="共需兑换数量"
                >
                  <template slot-scope="scope">{{
                    scope.row.source_amount
                  }}</template>
                </el-table-column>
                <el-table-column
                  sortable
                  :sort-by="['left_target_amount']"
                  label="待兑换数量"
                >
                  <template slot-scope="scope">{{
                    scope.row.left_target_amount
                  }}</template>
                </el-table-column>
                <el-table-column
                  sortable
                  :sort-by="['target_amount']"
                  label="已兑换数量"
                >
                  <template slot-scope="scope">{{
                    scope.row.target_amount
                  }}</template>
                </el-table-column>
                <el-table-column label="状态">
                  <template slot-scope="scope">
                    <span v-if="scope.row.status == 1">已提交</span>
                    <span v-if="scope.row.status == 2">未完成</span>
                    <span v-if="scope.row.status == 3">已完成</span>
                    <span v-if="scope.row.status == 4">未提交</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <div class="btn">
                      <span
                        class="blue"
                        v-if="scope.row.left_target_amount > 0"
                        @click="exchange(scope.row)"
                        >兑换</span
                      >
                      <span v-else>兑换</span>
                      <span class="blue" @click="airdrop(scope.row)">空投</span>
                      <span class="blue" @click="detaile(scope.row)">详情</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination">
                <el-pagination
                  @size-change="whitePageChange"
                  @current-change="whiteCurChange"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="whitePageSize"
                  :current-page="whitePageNo"
                  background
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total"
                >
                </el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane class="menu-title" label="黑名单" name="black">
              <el-table
                v-loading="tableLoading"
                :data="tables"
                @selection-change="selection"
                :header-cell-style="{
                  background: '#f5f5f5',
                  color: '#000',
                  borderRight: '1px solid #fff',
                  fontWeight: 'normal',
                }"
                style="width: 100%; font-size: 14px"
              >
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column label="ETH地址">
                  <template slot-scope="scope">
                    <div v-if="scope.row.source_address">
                      <el-tooltip
                        :content="scope.row.source_address"
                        placement="bottom"
                        effect="light"
                      >
                        <el-button class="normal">{{
                          scope.row.source_address.substr(0, 16) + "..."
                        }}</el-button>
                      </el-tooltip>
                    </div>
                    <div v-else>-</div>
                  </template>
                </el-table-column>
                <el-table-column label="BSC地址">
                  <template slot-scope="scope">
                    <div v-if="scope.row.target_address">
                      <el-tooltip
                        :content="scope.row.target_address"
                        placement="bottom"
                        effect="light"
                      >
                        <el-button class="normal">{{
                          scope.row.target_address.substr(0, 16) + "..."
                        }}</el-button>
                      </el-tooltip>
                    </div>
                    <div v-else>-</div>
                  </template>
                </el-table-column>
                <el-table-column
                  sortable
                  :sort-by="['source_amount']"
                  label="共需兑换数量"
                >
                  <template slot-scope="scope">{{
                    scope.row.source_amount
                  }}</template>
                </el-table-column>
                <el-table-column
                  sortable
                  :sort-by="['left_target_amount']"
                  label="待兑换数量"
                >
                  <template slot-scope="scope">{{
                    scope.row.left_target_amount
                  }}</template>
                </el-table-column>
                <el-table-column
                  sortable
                  :sort-by="['target_amount']"
                  label="已兑换数量"
                >
                  <template slot-scope="scope">{{
                    scope.row.target_amount
                  }}</template>
                </el-table-column>
                <el-table-column label="状态">
                  <template slot-scope="scope">
                    <span v-if="scope.row.status == 1">已提交</span>
                    <span v-if="scope.row.status == 2">未提交</span>
                    <span v-if="scope.row.status == 3">已完成</span>
                    <span v-if="scope.row.status == 4">未完成</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <div class="btn">
                      <span
                        class="blue"
                        v-if="scope.row.left_target_amount > 0"
                        @click="exchange(scope.row)"
                        >兑换</span
                      >
                      <span v-else>兑换</span>
                      <span class="blue" @click="airdrop(scope.row)">空投</span>
                      <span class="blue" @click="detaile(scope.row)">详情</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination">
                <el-pagination
                  @size-change="blackPageChange"
                  @current-change="blackCurChange"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="blackPageSize"
                  :current-page="blackPageNo"
                  background
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total"
                >
                </el-pagination></div
            ></el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="info">copyright © HOP 开源基金会</div>
    </div>
    <!-- 兑换 -->
    <div class="modal-alt" v-show="exchangeFlag">
      <div class="title">
        <span>代币兑换</span>
        <i @click="exchangeFlag = false" class="el-icon-close"></i>
      </div>
      <div class="center">
        <p>请输入兑换代币数量：</p>
        <div class="ipt">
          <span>兑换数量：</span>
          <el-input
            type="number"
            v-model="exchangeNum"
            placeholder="请输入"
          ></el-input>
        </div>
      </div>
      <div class="bottom">
        <span @click="exchangeFlag = false">取消</span>
        <span @click="exchangeSubmit" class="act">确定</span>
      </div>
    </div>
    <div
      class="modal-bg"
      v-show="exchangeFlag"
      @click="exchangeFlag = false"
    ></div>
    <!-- 空投 -->
    <div class="modal-alt" v-show="airdropFlag">
      <div class="title">
        <span>代币空投</span>
        <i @click="airdropFlag = false" class="el-icon-close"></i>
      </div>
      <div class="center">
        <p>请输入空投代币数量：</p>
        <div class="ipt">
          <span>空投数量：</span>
          <el-input
            type="number"
            v-model="airdropNum"
            placeholder="请输入"
          ></el-input>
        </div>
      </div>
      <div class="bottom">
        <span @click="airdropFlag = false">取消</span>
        <span @click="airdropSubmit" class="act">确定</span>
      </div>
    </div>
    <div
      class="modal-bg"
      v-show="airdropFlag"
      @click="airdropFlag = false"
    ></div>
    <!-- 全兑换 -->
    <div class="modal-alt" v-show="allExchangeFlag">
      <div class="title">
        <span>全兑换</span>
        <i @click="allExchangeFlag = false" class="el-icon-close"></i>
      </div>
      <div class="center">
        <p>注意：</p>
        <p>
          选择已提交且未完成兑换的HOP进行兑换，兑换数量取自用户提交的数量，兑换上限基于系统提供的白名单数量
        </p>
      </div>
      <div class="bottom">
        <span @click="allExchangeFlag = false">取消</span>
        <span @click="allExchangeSubmit" class="act">确定</span>
      </div>
    </div>
    <div
      class="modal-bg"
      v-show="allExchangeFlag"
      @click="allExchangeFlag = false"
    ></div>
    <!-- 全空投 -->
    <div class="modal-alt" v-show="allAirdropFlag">
      <div class="title">
        <span>全空投</span>
        <i @click="allAirdropFlag = false" class="el-icon-close"></i>
      </div>
      <div class="center">
        <p>注意：</p>
        <p>选择系统白名单对应的BSC地址进行空投。</p>
        <div class="ipt">
          <span>空投数量：</span>
          <el-input
            type="number"
            v-model="allAirdropNum"
            placeholder="请输入"
          ></el-input>
        </div>
      </div>
      <div class="bottom">
        <span @click="allAirdropFlag = false">取消</span>
        <span @click="allAirdropSubmit" class="act">确定</span>
      </div>
    </div>
    <div
      class="modal-bg"
      v-show="allAirdropFlag"
      @click="allAirdropFlag = false"
    ></div>
    <!-- 批量兑换 -->
    <div class="modal-alt" v-show="batchChangeFlag">
      <div class="title">
        <span>批量兑换</span>
        <i @click="batchChangeFlag = false" class="el-icon-close"></i>
      </div>
      <div class="center">
        <p>注意：</p>
        <p>
          选择已提交且未完成兑换的HOP进行兑换，且为选中的地址进行兑换，兑换数量取自用户提交的数量，，兑换数量上限基于系统提供的白名单数量。
        </p>
      </div>
      <div class="bottom">
        <span @click="batchChangeFlag = false">取消</span>
        <span @click="batchChangeSubmit" class="act">确定</span>
      </div>
    </div>
    <div
      class="modal-bg"
      v-show="batchChangeFlag"
      @click="batchChangeFlag = false"
    ></div>
    <!-- 批量空投 -->
    <div class="modal-alt" v-show="batchAirdropFlag">
      <div class="title">
        <span>批量空投</span>
        <i @click="batchAirdropFlag = false" class="el-icon-close"></i>
      </div>
      <div class="center">
        <p>注意：</p>
        <p>基于用户选择对应的BSC地址进行空投。</p>
        <div class="ipt">
          <span>空投数量：</span>
          <el-input
            type="number"
            v-model="batchAirdropNum"
            placeholder="请输入"
          ></el-input>
        </div>
      </div>
      <div class="bottom">
        <span @click="batchAirdropFlag = false">取消</span>
        <span @click="batchAirdropSubmit" class="act">确定</span>
      </div>
    </div>
    <div
      class="modal-bg"
      v-show="batchAirdropFlag"
      @click="batchAirdropFlag = false"
    ></div>
    <!-- 合约部署 -->
    <div class="modal-alt" v-show="deployFlag">
      <div class="title">
        <span>合约部署</span>
        <i @click="deployFlag = false" class="el-icon-close"></i>
      </div>
      <div class="center">
        <p>注意：</p>
        <p>请确实HOP-BEP20合约是否要在BSC网络部署。</p>
      </div>
      <div class="bottom">
        <span @click="deployFlag = false">取消</span>
        <span @click="deploySubmit" class="act">确定</span>
      </div>
    </div>
    <div class="modal-bg" v-show="deployFlag" @click="deployFlag = false"></div>
    <!-- 导入白名单 -->
    <div class="modal-alt" v-show="impFlag">
      <div class="title">
        <span>导入白名单</span>
        <i @click="impFlag = false" class="el-icon-close"></i>
      </div>
      <div class="center">
        <p>注意：</p>
        <p>该白名单文件包括HOP-ETH地址和HOP数量。</p>
        <div class="ipt">
          <span>白名单：</span>
          <el-upload
            class="upload"
            ref="upload"
            :auto-upload="false"
            :action="uploadUrl"
            :on-exceed="handleExceed"
            :headers="uploadHeaders"
            :before-upload="beforeAvatarUpload"
            :on-success="uploadSuccess"
            name="files"
            :limit="1"
            :file-list="fileList"
          >
            <el-button icon="el-icon-upload2" size="small" type="primary"
              >上传文件</el-button
            >
            <div slot="tip" class="el-upload__tip">支持扩展名：.csv</div>
          </el-upload>
        </div>
      </div>
      <div class="bottom">
        <span @click="impFlag = false">取消</span>
        <span @click="impSubmit" class="act">确定</span>
      </div>
    </div>
    <div class="modal-bg" v-show="impFlag" @click="impFlag = false"></div>
  </div>
</template>

<script>
import api from "@/api/api.js";
import HeaderTitle from "@/components/HeaderTitle.vue";
export default {
  data() {
    return {
      infos: {}, //兑换信息
      ethAddress: "",
      bscAddress: "",
      activeName: "white",
      disable: false, //false白名单，true黑名单
      whitePageSize: 10, //白名单每页条数
      blackPageSize: 10, //黑名单每页条数
      whitePageNo: 1, //白名单当前页数
      blackPageNo: 1, //黑名单当前页数
      total: 1, //总页数
      tables: [], //表单
      tableLoading: true, //表单loading
      exchangeFlag: false, //兑换当前弹框
      exchangeData: {}, //当前选中信息
      exchangeNum: "", //当前兑换数量
      airdropFlag: false, //空投当前弹框
      airdropNum: "", //当前空投数量
      allExchangeFlag: false, //全兑换
      allAirdropFlag: false, //全空投
      allAirdropNum: "", //全空投数量
      batchChangeFlag: false, //批量兑换
      batchAirdropFlag: false, //批量空投
      batchAirdropNum: "", //批量空投数量
      selectionArr: [], //选中的项目
      deployFlag: false, //合约部署弹框
      impFlag: false, //导入白名单弹框
      uploadUrl: "", //上传地址
      uploadHeaders: {}, //上传文件头
      fileList: [], //白名单文件
    };
  },
  components: {
    HeaderTitle,
  },
  created() {
    this.uploadUrl = `http://152.32.210.47:8083${api.upload}`;
    this.uploadHeaders = {
      authorization: localStorage.token,
    };
    this.address();
    this.getInfo();
  },
  methods: {
    handleExceed(files, fileList) {
      this.$message.warning("最多上传一个文件");
    },
    beforeAvatarUpload(file) {
      // console.log(file);
      // const isCsv = file.type === "csv";
      // if (!isCsv) {
      //   this.$message.error("支持扩展名.csv");
      // }
      // return isCsv;
    },
    deploySubmit() {
      //合约部署
      this.deployFlag = false;
      this.$http({
        method: "get",
        url: api.issue,
      }).then((rel) => {
        this.$message({
          message: rel.detail,
        });
      });
    },
    impSubmit() {
      this.$refs.upload.submit();
    },
    uploadSuccess(e) {
      this.impFlag = false;
      this.$message(e.detail);
    },
    getInfo() {
      //兑换信息
      this.$http({
        method: "get",
        url: api.info,
      }).then((rel) => {
        if (rel.code == 200) {
          this.infos = rel.data;
        } else {
          this.$message({
            message: rel.detail,
            type: "error",
          });
        }
      });
    },
    address() {
      let page_num = this.disable ? this.blackPageNo : this.whitePageNo;
      let pageSize = this.disable ? this.blackPageSize : this.whitePageSize;
      //兑换列表
      this.$http({
        method: "get",
        url: api.address,
        params: {
          source: this.ethAddress,
          target: this.bscAddress,
          page_num: page_num,
          page_size: pageSize,
          disable: this.disable,
        },
      }).then((rel) => {
        if (rel.code == 200) {
          this.total = rel.data.total;
          this.tables = rel.data.items;
          this.tableLoading = false;
        } else {
          this.$message({
            message: rel.detail,
            type: "error",
          });
        }
      });
    },
    search() {
      this.address();
    },
    reset() {
      this.ethAddress = "";
      this.bscAddress = "";
      this.address();
    },
    airdrop(e) {
      this.exchangeData = e;
      this.airdropFlag = true;
    },
    exchange(e) {
      this.exchangeData = e;
      this.exchangeFlag = true;
    },
    airdropSubmit() {
      if (this.airdropNum > 0) {
        //空投代币
        this.tableLoading = true;
        this.airdropFlag = false;
        this.$http({
          method: "get",
          url: api.airdrop,
          params: {
            address: this.exchangeData.source_address,
            value: this.airdropNum,
          },
        }).then((rel) => {
          this.airdropNum = "";

          if (rel.code == 200) {
            this.$message({
              message: "空投成功",
              type: "success",
            });
            this.address();
            this.getInfo();
          } else {
            this.$message({
              message: rel.detail,
              type: "error",
            });
          }
        });
      }
    },
    exchangeSubmit() {
      if (this.exchangeNum > 0) {
        //兑换代币
        this.tableLoading = true;
        this.exchangeFlag = false;
        this.$http({
          method: "get",
          url: api.swap,
          params: {
            address: this.exchangeData.source_address,
            value: this.exchangeNum,
          },
        }).then((rel) => {
          this.exchangeNum = "";

          if (rel.code == 200) {
            this.$message({
              message: "兑换成功",
              type: "success",
            });
            this.address();
            this.getInfo();
          } else {
            this.$message({
              message: rel.detail,
              type: "error",
            });
          }
        });
      }
    },

    allExchangeSubmit() {
      //全兑换
      this.allExchangeFlag = false;
      this.tableLoading = true;
      this.$http({
        method: "get",
        url: api.swapall,
      }).then((rel) => {
        if (rel.code == 200) {
          this.$message({
            message: "兑换成功",
            type: "success",
          });
          this.address();
          this.getInfo();
        } else {
          this.$message({
            message: rel.detail,
            type: "error",
          });
        }
      });
    },
    allAirdropSubmit() {
      //全空投
      if (this.allAirdropNum > 0) {
        this.tableLoading = true;
        this.allAirdropFlag = false;
        this.$http({
          method: "get",
          url: api.airdropall,
          params: {
            value: this.allAirdropNum,
          },
        }).then((rel) => {
          this.allAirdropNum = "";
          if (rel.code == 200) {
            this.$message({
              message: "空投成功",
              type: "success",
            });
            this.address();
            this.getInfo();
          } else {
            this.$message({
              message: rel.detail,
              type: "error",
            });
          }
        });
      }
    },
    batchChangeSubmit() {
      let flag = true;
      this.selectionArr.forEach((val) => {
        if (val.left_target_amount == 0) {
          flag = false;
        }
      });
      if (this.selectionArr.length > 0 && flag) {
        let address = "";
        this.selectionArr.forEach((val) => {
          address = address + "address=" + val.source_address + "&";
        });
        address = address.slice(0, -1);
        this.tableLoading = true;
        //批量兑换
        this.batchChangeFlag = false;
        this.$http({
          method: "get",
          url: `${api.swap}?${address}`,
        }).then((rel) => {
          if (rel.code == 200) {
            this.$message({
              message: "批量兑换成功",
              type: "success",
            });
            this.address();
            this.getInfo();
          } else {
            this.$message({
              message: rel.detail,
              type: "error",
            });
          }
        });
      } else {
        this.$message("未选择兑换项或待兑换数量为0");
      }
    },
    batchAirdropSubmit() {
      //批量空投
      if (this.selectionArr.length > 0) {
        let address = "";
        this.selectionArr.forEach((val) => {
          address = address + "address=" + val.source_address + "&";
        });
        address = address.slice(0, -1);
        this.tableLoading = true;
        //批量兑换
        this.batchAirdropFlag = false;
        this.$http({
          method: "get",
          url: `${api.airdrop}?${address}&value=${this.batchAirdropNum}`,
        }).then((rel) => {
          if (rel.code == 200) {
            this.batchAirdropNum = "";
            this.$message({
              message: "批量空投成功",
              type: "success",
            });
            this.address();
            this.getInfo();
          } else {
            this.$message({
              message: rel.detail,
              type: "error",
            });
          }
        });
      } else {
        this.$message("请选择空投项");
      }
    },
    detaile(e) {
      this.$router.push({
        name: "detaile",
        query: { address: e.source_address },
      });
    },
    handleClick(tab) {
      this.tableLoading = true;
      this.activeName = tab.name;
      if (tab.name == "black") {
        this.disable = true;
      } else {
        this.disable = false;
      }
      this.address();
    },
    whitePageChange(num) {
      this.whitePageSize = num;
      this.tableLoading = true;
      this.address();
    },
    whiteCurChange(num) {
      this.whitePageNo = num;
      this.tableLoading = true;
      this.address();
    },
    selection(e) {
      this.selectionArr = e;
    },
    blackPageChange(num) {
      this.blackPageSize = num;
      this.tableLoading = true;
      this.address();
    },
    blackCurChange(num) {
      this.blackPageNo = num;
      this.tableLoading = true;
      this.address();
    },
  },
};
</script>
<style lang="scss" scoped>
#main {
  position: absolute;
  top: 70px;
  left: 0;
  right: 0;
  background: #f2f3f6;
  min-height: 800px;
  padding: 20px 20px 50px;
  .info {
    text-align: center;
    color: #666;
    font-size: 14px;
    position: absolute;
    bottom: 15px;
    left: 0;
    width: 100%;
  }
  .datas {
    background: #fff;
    border-radius: 5px;
    padding: 30px;
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    font-weight: bold;
    span {
      font-size: 14px;
      color: #000;
      margin-right: 8%;
    }
  }
}
.table {
  background: #fff;
  padding: 25px 35px;
  border-radius: 5px;
  .pagination {
    padding: 30px 0;
    text-align: right;
  }
  .toolbar {
    margin-bottom: 25px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .select {
      margin-right: 30px;
      display: flex;
      align-items: center;
      span {
        width: 80px;
        font-size: 14px;
      }
      .ipt,
      .el-select {
        width: 300px;
      }
    }
    .left {
      display: flex;
      align-items: center;
    }
    .box {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .btn {
      margin-left: 30px;
    }
  }
  .exchange {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .btn {
      margin-right: 40px;
    }
  }
  .left8 {
    margin-left: 80px;
  }
  .left4 {
    margin-left: 40px;
  }
  .content {
    ::v-deep .el-tabs__item {
      font-size: 16px;
    }
    .normal {
      border: none;
      outline: none;
      background: none;
      padding: 0;
    }
    .btn {
      span {
        color: #999;
        margin: 0 10px;
        cursor: no-drop;
      }
      .blue {
        color: #409eff;
        cursor: pointer;
      }
    }
  }
}

.modal-bg {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 998;
  background: rgba(0, 0, 0, 0.4);
}
.modal-alt {
  position: fixed;
  z-index: 999;
  background: #fff;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 500px;
  width: 80%;
  box-shadow: 0 0 10px #3c3c3c;
}
.modal-alt .title {
  padding: 20px;
  border-bottom: 1px solid #d0d0d0;
  display: flex;
  font-size: 16px;
  align-items: center;
  justify-content: space-between;
  i {
    font-size: 24px;
    cursor: pointer;
  }
}
.modal-alt .center {
  padding: 6% 12%;
  p {
    font-size: 15px;
    color: #999;
    line-height: 1.5;
    margin: 5px 0;
  }
  .ipt {
    display: flex;
    align-content: center;
    justify-content: center;
    padding: 20px 0 10px;
    span {
      font-size: 15px;
      color: #333;
      width: 110px;
      height: 40px;
      line-height: 40px;
    }
  }
}
.modal-alt .bottom {
  padding: 20px;
  border-top: 1px solid #d0d0d0;
  text-align: right;
  span {
    width: 110px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    font-size: 15px;
    display: inline-block;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 20px;
  }
  .act {
    background: #596aff;
    color: #fff;
  }
}
</style>
