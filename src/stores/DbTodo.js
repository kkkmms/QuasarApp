import { defineStore } from 'pinia'
import todoApi from "src/apis/todoApi";

export const useDbTodoStore = defineStore('useDbTodo', {
  state: () => ({
    tasks: [],
    totalCount: 0,
    origin: null,
    editTask: null,
  }),
  actions: {
    async fetchData() {
      const len = 5;
      const lastId = this.tasks.length ? this.tasks[this.tasks.length - 1].id : 0;

      if (this.tasks.length > 0 && this.tasks.length === this.totalCount) {
        console.log("fetchData 호출안함", this.tasks.length, this.totalCount);
        return false;
      }

      const payload = {
        lastId,
        len,
      };

      const result = await todoApi.list(payload);

      if (result.data && result.data.list) {
        this.tasks = [...this.tasks, ...result.data.list];
        this.totalCount = result.data.totalCount;
      }
    },
    async addDbTask(title) {
      if (!title) {
        return;
      }

      const payload = {
        title,
      };

      const result = await todoApi.create(payload);

      if (result.status === 200) {
        if (result.data.id) {
          this.tasks.unshift({
            id: result.data.id,
            title,
            done: 'N',
          });
          this.totalCount++;
        }
      }
    },
    async editDBTodo(item) {
      const idx = this.tasks.findIndex(task => task === item);
      item.done = 'N';
      this.tasks.splice(idx, 1, item);

      if (item.title !== this.origin) {
        await todoApi.update(item);
      }
    },
    async removeDBItem(item) {
      const idx = this.tasks.findIndex(task => task.id === item.id);
      this.tasks.splice(idx, 1);

      await todoApi.remove(item);
    },
    async resetDb() {
      if (this.tasks) {
        this.tasks = [];
      }

      const payload = {
        title: "todo_",
        done: "N",
        len: 100,
      };

      const result = await todoApi.reset(payload);

      if (result.status === 200) {
        this.fetchData();
      }
    },
    setOrigin(origin) {
      this.origin = origin;
    },
    setEditTask(task) {
      this.editTask = task;
    },
  },
});
