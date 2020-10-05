<template>
<div class="btn-toolbar row shadow pt-1" data-role="editor-toolbar" data-target="#editor">
    <div class="col-2"/>
      <div class="btn-group">
        <button class="btn" data-edit="bold" title="" data-original-title="Bold (Ctrl/Cmd+B)"><i class="fas fa-undo "></i></button>
        <button class="btn" data-edit="italic" title="" data-original-title="Italic (Ctrl/Cmd+I)"><i class="fas fa-redo"></i></button>
        <button class="btn" title="" data-original-title="Italic (Ctrl/Cmd+I)"><i class="fas fa-file-download"></i></button>
      </div>
      <div class="col-2"/>
      <div class="col-4"/>
      <div class="btn-group pl-2">
        <button class="btn" data-edit="insertunorderedlist" title="" data-original-title="Bullet list"><i class="fas fa-list-ul"></i></button>
        <button class="btn" data-edit="insertorderedlist" title="" data-original-title="Number list"><i class="fas fa-stream"></i></button>
      </div>
      <div class="btn-group pl-2">
          <button class="btn" data-edit="undo" title="" data-original-title="undo"><i class="fas fa-user-plus"></i></button>
          <button class="btn" data-toggle="dropdown" title="" data-original-title="Hyperlink"><i class="fas fa-link"></i></button>
            <div class="dropdown-menu input-append">
                <input class="span2" placeholder="URL" type="text" data-edit="createLink" readonly="readonly">
                <button class="btn" type="button">Add</button>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  name: 'ToolBar'
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

#btn-group {
    margin:auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.btn:hover {
    background-color: #A0A0A0;
}

.btn-toolbar {
    background-color: #eaeaea;
}

[contentEditable=true]:empty:not(:focus):before {
    content:attr(data-placeholder)
}

/*
    Font Sizes
    fs represents the font-size attribute; therefore,
    fs-five would be the equivalent to font-size: 5;
*/

</style>
