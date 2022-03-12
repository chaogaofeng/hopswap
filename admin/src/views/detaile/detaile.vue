<template>
  <div class="page">
    <header-title></header-title>
    <div id="main">
      <div class="title-top">
        <i @click="goback" class="el-icon-arrow-left"></i>
        <span>地址交易详情</span>
      </div>
      <div class="table">
        <div class="content">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane class="menu-title" label="销毁" name="xh">
              <el-table
                class="eltable"
                v-loading="tableLoading"
                :data="tables"
                :header-cell-style="{
                  background: '#f5f5f5',
                  color: '#000',
                  borderRight: '1px solid #fff',
                  fontWeight: 'normal',
                }"
                style="width: 100%; font-size: 14px"
              >
                <el-table-column label="源地址"
                  ><template slot-scope="scope">
                    <div v-if="scope.row.from">
                      <el-tooltip
                        :content="scope.row.from"
                        placement="bottom"
                        effect="light"
                      >
                        <el-button class="normal">{{
                          scope.row.from.substr(0, 16) + "..."
                        }}</el-button>
                      </el-tooltip>
                    </div>
                    <div v-else>-</div>
                  </template>
                </el-table-column>
                <el-table-column label="目标地址">
                  <template slot-scope="scope">
                    <div v-if="scope.row.to">
                      <el-tooltip
                        :content="scope.row.to"
                        placement="bottom"
                        effect="light"
                      >
                        <el-button class="normal">{{
                          scope.row.to.substr(0, 16) + "..."
                        }}</el-button>
                      </el-tooltip>
                    </div>
                    <div v-else>-</div>
                  </template>
                </el-table-column>
                <el-table-column
                  sortable
                  :sort-by="['height']"
                  label="区块高度"
                >
                  <template slot-scope="scope">{{ scope.row.height }}</template>
                </el-table-column>
                 <el-table-column
                  sortable
                  :sort-by="['value']"
                  label="交易数量"
                >
                  <template slot-scope="scope">{{ scope.row.value }}</template>
                </el-table-column>
                <el-table-column label="交易哈希">
                  <template slot-scope="scope">
                    <el-tooltip
                      :content="scope.row.tx_hash"
                      placement="bottom"
                      effect="light"
                    >
                      <el-button class="normal">{{
                        scope.row.tx_hash.substr(0, 16) + "..."
                      }}</el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination">
                <el-pagination
                  @size-change="sizeChange1"
                  @current-change="pageChange1"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="pageSize1"
                  :current-page="page_num1"
                  background
                  layout=" prev, pager, next,sizes, jumper"
                  :total="total"
                >
                </el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane class="menu-title" label="兑换" name="dh">
              <el-table
                class="eltable"
                v-loading="tableLoading"
                :data="tables"
                :header-cell-style="{
                  background: '#f5f5f5',
                  color: '#000',
                  borderRight: '1px solid #fff',
                  fontWeight: 'normal',
                }"
                style="width: 100%; font-size: 14px"
              >
                <el-table-column label="源地址"
                  ><template slot-scope="scope">
                    <div v-if="scope.row.from">
                      <el-tooltip
                        :content="scope.row.from"
                        placement="bottom"
                        effect="light"
                      >
                        <el-button class="normal">{{
                          scope.row.from.substr(0, 16) + "..."
                        }}</el-button>
                      </el-tooltip>
                    </div>
                    <div v-else>-</div>
                  </template>
                </el-table-column>
                <el-table-column label="目标地址">
                  <template slot-scope="scope">
                    <div v-if="scope.row.to">
                      <el-tooltip
                        :content="scope.row.to"
                        placement="bottom"
                        effect="light"
                      >
                        <el-button class="normal">{{
                          scope.row.to.substr(0, 16) + "..."
                        }}</el-button>
                      </el-tooltip>
                    </div>
                    <div v-else>-</div>
                  </template>
                </el-table-column>
                <el-table-column
                  sortable
                  :sort-by="['height']"
                  label="区块高度"
                >
                  <template slot-scope="scope">{{ scope.row.height }}</template>
                </el-table-column>
                 <el-table-column
                  sortable
                  :sort-by="['value']"
                  label="交易数量"
                >
                  <template slot-scope="scope">{{ scope.row.value }}</template>
                </el-table-column>
                <el-table-column label="交易哈希">
                  <template slot-scope="scope">
                    <el-tooltip
                      :content="scope.row.tx_hash"
                      placement="bottom"
                      effect="light"
                    >
                      <el-button class="normal">{{
                        scope.row.tx_hash.substr(0, 16) + "..."
                      }}</el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination">
                <el-pagination
                  @size-change="sizeChange2"
                  @current-change="pageChange2"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="pageSize2"
                  :current-page="page_num2"
                  background
                  layout=" prev, pager, next,sizes, jumper"
                  :total="total"
                >
                </el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane class="menu-title" label="空投" name="kt">
              <el-table
                class="eltable"
                v-loading="tableLoading"
                :data="tables"
                :header-cell-style="{
                  background: '#f5f5f5',
                  color: '#000',
                  borderRight: '1px solid #fff',
                  fontWeight: 'normal',
                }"
                style="width: 100%; font-size: 14px"
              >
                <el-table-column label="源地址"
                  ><template slot-scope="scope">
                    <div v-if="scope.row.from">
                      <el-tooltip
                        :content="scope.row.from"
                        placement="bottom"
                        effect="light"
                      >
                        <el-button class="normal">{{
                          scope.row.from.substr(0, 16) + "..."
                        }}</el-button>
                      </el-tooltip>
                    </div>
                    <div v-else>-</div>
                  </template>
                </el-table-column>
                <el-table-column label="目标地址">
                  <template slot-scope="scope">
                    <div v-if="scope.row.to">
                      <el-tooltip
                        :content="scope.row.to"
                        placement="bottom"
                        effect="light"
                      >
                        <el-button class="normal">{{
                          scope.row.to.substr(0, 16) + "..."
                        }}</el-button>
                      </el-tooltip>
                    </div>
                    <div v-else>-</div>
                  </template>
                </el-table-column>
                <el-table-column
                  sortable
                  :sort-by="['height']"
                  label="区块高度"
                >
                  <template slot-scope="scope">{{ scope.row.height }}</template>
                </el-table-column>
                 <el-table-column
                  sortable
                  :sort-by="['value']"
                  label="交易数量"
                >
                  <template slot-scope="scope">{{ scope.row.value }}</template>
                </el-table-column>
                <el-table-column label="交易哈希">
                  <template slot-scope="scope">
                    <el-tooltip
                      :content="scope.row.tx_hash"
                      placement="bottom"
                      effect="light"
                    >
                      <el-button class="normal">{{
                        scope.row.tx_hash.substr(0, 16) + "..."
                      }}</el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination">
                <el-pagination
                  @size-change="sizeChange3"
                  @current-change="pageChange3"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="pageSize3"
                  :current-page="page_num3"
                  background
                  layout=" prev, pager, next,sizes, jumper"
                  :total="total"
                >
                </el-pagination>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/api.js";
import HeaderTitle from "@/components/HeaderTitle.vue";
export default {
  data() {
    return {
      address: "",
      tableLoading: true,
      page_num1: 1,
      page_num2: 1,
      page_num3: 1,
      pageSize1: 10,
      pageSize2: 10,
      pageSize3: 10,
      total: 1,
      activeName: "xh",
      tables: [],
    };
  },
  components: {
    HeaderTitle,
  },
  created() {
    this.address = this.$route.query.address;
    this.getData();
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    sizeChange1(num) {
      this.pageSize1 = num;
      this.tableLoading = true;
      this.getData();
    },
    pageChange1(num) {
      this.page_num1 = num;
      this.tableLoading = true;
      this.getData();
    },
    sizeChange2(num) {
      this.pageSize2 = num;
      this.tableLoading = true;
      this.getData();
    },
    pageChange2(num) {
      this.page_num2 = num;
      this.tableLoading = true;
      this.getData();
    },
    sizeChange3(num) {
      this.pageSize3 = num;
      this.tableLoading = true;
      this.getData();
    },
    pageChange3(num) {
      this.page_num3 = num;
      this.tableLoading = true;
      this.getData();
    },
    getData() {
      let page_num = 1;
      let pageSize = 10;
      let url = "";
      if (this.activeName == "xh") {
        page_num = this.page_num1;
        pageSize = this.pageSize1;
        url = `/${this.address}${api.recycleList}`;
      }
      if (this.activeName == "dh") {
        page_num = this.page_num2;
        pageSize = this.pageSize2;
        url = `/${this.address}${api.swapList}`;
      }
      if (this.activeName == "kt") {
        page_num = this.page_num3;
        pageSize = this.pageSize3;
        url = `/${this.address}${api.airdropList}`;
      }
      this.$http({
        method: "get",
        url: url,
        params: {
          address: this.address,
          page_num: page_num,
          page_size: pageSize,
        },
      }).then((rel) => {
        this.tableLoading = false;
        if (rel.code == 200) {
          this.tables = rel.data.items;
          this.total = rel.data.total;
        } else {
          this.$message({
            message: rel.message,
            type: "error",
          });
        }
      });
    },
    handleClick(tab) {
      this.tableLoading = true;
      this.activeName = tab.name;
      // if (tab.name == "black") {
      //   this.disable = true;
      // } else {
      //   this.disable = false;
      // }
      this.getData();
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
}
.title-top {
  padding: 20px 0 30px;
  i {
    color: #333;
    cursor: pointer;
    font-size: 26px;
  }
  span {
    color: #333;
    font-size: 18px;
    vertical-align: 2px;
    margin-left: 10px;
  }
}
.table {
  background: #fff;
  padding: 25px 35px;
  border-radius: 5px;
  .eltable {
    min-height: 550px;
  }
  .pagination {
    padding: 30px 0;
    text-align: center;
  }
  .content {
    ::v-deep .el-tabs__item {
      font-size: 16px;
    }
     ::v-deep .el-tabs__header {
      margin: 0 0 5px;
    }
    .normal {
      border: none;
      outline: none;
      background: none;
      padding: 0;
    }
  }
}
</style>
