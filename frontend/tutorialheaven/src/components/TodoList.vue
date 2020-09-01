<template>
<div class="appBackground pt-1">
<div id="content" class="container">
    <div>
        <div v-for="(todo, index) in todos" :key="todo.id" class="todo-item row" @click="editTodo(todo)">
            <div v-if="!todo.editing" class="todo-item-label col-2" @click="editTodo(todo)">
                {{ todo.title }}
            </div>
            <input v-else class="todo-input" type="text" v-model="todo.title  " v-focus @keyup.enter="doneEdit(todo)" @blur="doneEdit(todo)" @keyup.esc="cancelEdit(todo)"/>            
            <div class="remove-item" @click="removeTodo(index)">&times;</div>
    </div>
    <button type="button" @click="addTodo">Add New Task</button>
    </div>
</div>
</div>
</template>
<script>
export default {
  name: "TodoList",
  data() {
    return {
    newTodo: "",
    idForTodo: 3,
    beforeEdit: "",
    todos: [
           {
               "id": 1,
              "title": "Research and Investigation",
              "completed": true,
              "editing": false
           },
           {
               "id": 2,
               "title": "Planning and Tool Selection",
               "completed": false,
               "editing": false
           }
          ]
      }
  },
  directives: {
      focus: {
          inserted: function(el) {
              el.focus()
          }
      }
  },
  methods: {
      addTodo() {
          this.todos.push({
              id: this.idForTodo,
              title: this.newTodo,
              completed: false,
              editing: true
          })
          
          this.newTodo = "";
          this.idForTodo = this.idForTodo + 1;
          },
        removeTodo(index) {
            this.todos.splice(index, 1);
        },
        editTodo(todo) {
           this.beforeEdit = todo.title;
            todo.editing = true;
        },
        doneEdit(todo) {
            todo.editing = false;
        },
        cancelEdit(todo) {
            todo.title = this.beforeEdit
            todo.editing = false;
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.todo-input {
    width: 100%;
    padding: 10px 10px;
    font-size: 14px;
    margin-bottom: 16px;
}

.todo-item {
    margin-bottom: 12px;
    display: flex;
    align-items: left;
    justify-content: space-between;
}

.drag-item {
    cursor: pointer;
    display: flex;
}

.remove-item {
    cursor: pointer;
    float: right;
    &:hover {
        color: black;
    }
}
</style>
