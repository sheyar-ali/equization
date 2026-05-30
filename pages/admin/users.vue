<template>
  <v-container fluid class="pa-6">
    <h1 class="page-title mb-6">إدارة المستخدمين</h1>

    <!-- Search -->
    <v-card class="rounded-lg mb-4" elevation="1">
      <v-card-text class="py-3">
        <v-text-field
          v-model="search"
          outlined dense hide-details
          prepend-inner-icon="mdi-magnify"
          label="بحث باسم المستخدم أو البريد الإلكتروني"
          @keyup.enter="fetchUsers"
          clearable
          @click:clear="onClear"
          dir="rtl"
        />
      </v-card-text>
    </v-card>

    <v-card class="rounded-lg" elevation="2">
      <v-data-table
        :headers="headers"
        :items="users"
        :loading="loading"
        :server-items-length="total"
        :options.sync="tableOptions"
        loading-text="جاري التحميل..."
        no-data-text="لا يوجد مستخدمون"
        dir="rtl"
        @update:options="fetchUsers"
      >
        <template #item.username="{ item }">
          <div class="d-flex align-center">
            <v-avatar :color="item.role === 'admin' ? '#6c63ff' : '#ff5e94'" size="34" class="ml-3">
              <span class="white--text caption font-weight-bold">
                {{ (item.username || '?').charAt(0).toUpperCase() }}
              </span>
            </v-avatar>
            <div>
              <div class="font-weight-bold">{{ item.username }}</div>
              <div class="caption grey--text">{{ item.email }}</div>
            </div>
          </div>
        </template>

        <template #item.role="{ item }">
          <v-chip x-small :color="item.role === 'admin' ? '#6c63ff' : 'grey'" dark>
            {{ item.role === 'admin' ? 'مدير' : 'مستخدم' }}
          </v-chip>
        </template>

        <template #item.isVerified="{ item }">
          <v-icon :color="item.isVerified ? 'teal' : 'orange'" small>
            {{ item.isVerified ? 'mdi-check-circle' : 'mdi-clock-outline' }}
          </v-icon>
        </template>

        <template #item.createdAt="{ item }">
          <span class="caption">{{ formatDate(item.createdAt) }}</span>
        </template>

        <template #item.actions="{ item }">
          <v-tooltip bottom>
            <template #activator="{ on }">
              <v-btn
                icon small
                :color="item.role === 'admin' ? 'grey' : '#6c63ff'"
                v-on="on"
                @click="toggleAdmin(item)"
                :disabled="item._id === currentUserId"
              >
                <v-icon small>{{ item.role === 'admin' ? 'mdi-shield-remove' : 'mdi-shield-account' }}</v-icon>
              </v-btn>
            </template>
            <span>{{ item.role === 'admin' ? 'إزالة صلاحية المدير' : 'منح صلاحية المدير' }}</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>

    <v-snackbar v-model="snack.show" :color="snack.color" top right timeout="3000">
      {{ snack.text }}
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  layout: 'admin',
  middleware: 'admin',
  head() { return { title: 'المستخدمون — لوحة التحكم' }; },

  data() {
    return {
      users:        [],
      total:        0,
      loading:      true,
      search:       '',
      tableOptions: { page: 1, itemsPerPage: 10 },
      snack:        { show: false, text: '', color: 'success' },
      headers: [
        { text: 'المستخدم',   value: 'username',   align: 'right'   },
        { text: 'الدور',      value: 'role',       align: 'center'  },
        { text: 'موثّق',      value: 'isVerified', align: 'center'  },
        { text: 'تاريخ التسجيل', value: 'createdAt', align: 'center' },
        { text: 'إجراءات',    value: 'actions',    sortable: false, align: 'center' },
      ],
    };
  },

  computed: {
    currentUserId() {
      return this.$store.state.user?._id || this.$store.state.user?.id;
    },
  },

  methods: {
    async fetchUsers() {
      this.loading = true;
      try {
        const { page, itemsPerPage } = this.tableOptions;
        const params = new URLSearchParams({ page, limit: itemsPerPage });
        if (this.search) params.append('search', this.search);

        const res = await this.$axios.get(`/users?${params}`);
        this.users = res.data?.data?.users || res.data?.data || [];
        this.total = res.data?.pagination?.total || this.users.length;
      } catch (e) {
        this.showSnack('فشل تحميل المستخدمين', 'error');
      } finally {
        this.loading = false;
      }
    },

    async toggleAdmin(user) {
      const newRole = user.role === 'admin' ? 'user' : 'admin';
      try {
        await this.$axios.put(`/users/${user._id}/role`, { role: newRole });
        user.role = newRole;
        this.showSnack(newRole === 'admin' ? 'تم منح صلاحية المدير' : 'تم إزالة الصلاحية');
      } catch (e) {
        this.showSnack(e.response?.data?.message || 'فشل تغيير الدور', 'error');
      }
    },

    onClear() {
      this.search = '';
      this.fetchUsers();
    },

    formatDate(d) {
      if (!d) return '';
      return new Date(d).toLocaleDateString('ar-EG');
    },

    showSnack(text, color = 'success') {
      this.snack = { show: true, text, color };
    },
  },
};
</script>

<style scoped>
.page-title { font-size: 24px; color: #1e1b4b; font-family: 'Cairo'; font-weight: 700; }
</style>
