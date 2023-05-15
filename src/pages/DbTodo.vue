<template>
  <q-page class="bg-grey-3 column">
    <div class="row q-pa-sm bg-primary">
      <q-input
        v-model="newTask"
        @keyup.enter="addDbTask"
        class="col"
        bg-color="white"
        filled
        aria-placeholder="Add task"
        dense
      >
        <template v-slot:append>
          <q-btn @click="addDbTask" round dense flat icon="add"></q-btn>
        </template>
      </q-input>
    </div>

    <q-btn label="reset" @click="resetDb"></q-btn>
    <q-list class="bg-white" separator bordered>
      <q-item
        v-for="item in tasks"
        :key="item.title"
        @click="item.done = item.done == 'Y' ? 'N' : 'Y'"
        :class="{ 'done bg-blue-1': item.done == 'Y' }"
        v-ripple
        clickable
      >
        <q-item-section avatar>
          <q-checkbox
            v-model="item.done"
            color="primary"
            class="no-pointer-event"
            true-value="Y"
            false-value="N"
            dense
          ></q-checkbox>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ item.title }}</q-item-label>
        </q-item-section>
        <q-item-section v-if="item.done == 'Y'" side>
          <q-btn
            flat
            round
            dense
            color="primary"
            icon="edit"
            @click.stop="openDialog(item)"
          >
          </q-btn>
        </q-item-section>
        <q-item-section v-if="item.done == 'Y'" side>
          <q-btn
            flat
            round
            dense
            color="red"
            icon="delete"
            @click.stop="removeDBItem(item)"
          ></q-btn>
        </q-item-section>
      </q-item>
      <div v-intersection="onIntersection" v-if="tasks.length"></div>
    </q-list>
    <div v-if="!tasks.length" class="no-tasks absolute-center">
      <q-icon name="check" size="100px" color="primary" />
      <div class="text-h5 text-primary text-center">No tasks</div>
    </div>
    <DialogCustom
      ref="dialog"
      :edit-task="editTask"
      :origin="origin"
      @onInput="editDBTodo"
    >
    </DialogCustom>
  </q-page>
</template>

<script>
import { useDbTodoStore } from "src/stores/DbTodo";
import { defineComponent } from "vue";
import todoApi from "src/apis/todoApi";
import DialogCustom from "components/DialogCustom.vue";

export default {
  name: "Todo",
  title: "DB Todo list",
  components: { DialogCustom },
  setup() {
    const {
      tasks,
      totalCount,
      fetchData,
      addDbTask,
      editDBTodo,
      removeDBItem,
      resetDb,
      setOrigin,
      setEditTask,
      origin,
      editTask
    } = useDbTodoStore();
    onMounted(fetchData);

 return {
  tasks,
  totalCount,
  fetchData,
  addDbTask,
  editDBTodo,
  removeDBItem,
  resetDb,
  setOrigin,
  setEditTask,
  origin,
  editTask
};
},
methods: {
onIntersection(entry) {
  if (entry.isIntersecting) {
    this.fetchData();
  }
},
openDialog(item) {
  this.setEditTask(item);
  this.setOrigin(this.editTask.title);
},
},
};
</script>

<style lang="scss">
.done {
.q-item__label {
  text-decoration: line-through;
  color: #bbb;
}
}
.no-tasks {
opacity: 0.5;
}
</style>
