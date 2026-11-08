/* shared/config.js —— 同步用的 Supabase 设置。
   不想同步就别动，留空即可，页面照常用，只是内容存在本机。
   填法见仓库根目录的 SUPABASE.md。

   这里填的是「公开的」URL 和 anon / publishable key，放在网页里是正常的，
   数据的安全靠建表时那份 SQL（表本身不对外开放，只能用房间码读写）。
   不要把 service_role key 放进来。 */
window.TRIPS_CONFIG = {
  supabaseUrl: '',   // 例：https://abcdxyz.supabase.co
  supabaseKey: ''    // 例：sb_publishable_xxx 或 eyJ... 开头的 anon key
};
