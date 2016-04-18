/* ContentEditor - tinymce with custom global saving and editing controls. Any elements of the following types with 
 * data-editable=true will be made into editor instances:
 */
if (typeof ContentEditor === 'undefined') {
  ContentEditor = {
    _controlInitDone: false

    /* Disable and hide all editor instances
     */
    , disableEditors: function() {
      $.each(tinymce.EditorManager.editors, function(index, editor) {
        // Hack: need to save and restore the dirty state because hide() 
        // sets isNotDirty to true
        var wasDirty = editor.isDirty();
        editor.hide(); 
        editor.setDirty(wasDirty);
      });   
    }
    /* Enable all editor instances (does not make any editors active despite the 
     * editor.show() call)
     */
    , enableEditors: function() {
      $.each(tinymce.EditorManager.editors, function(index, editor) {
        editor.show(); 
      });
    }
    /* Toggle the page's edit mode. When off, the page appears as it would to a non-editor, and you cannot
     * activate any editors. When on, clicking on an editable element activates its editor.
     */
    , toggleEditMode: function() {
      var switchElem = $(this)
      , textElem = $('#EDIT_STATE_TEXT');

      if (switchElem.hasClass('fa-toggle-off')) {
        switchElem.removeClass('fa-toggle-off');
        switchElem.addClass('fa-toggle-on');
        textElem.html("Edit mode on")

        ContentEditor.enableEditors();
      } else {
        switchElem.removeClass('fa-toggle-on');
        switchElem.addClass('fa-toggle-off');
        textElem.html("Edit mode off")
        
        ContentEditor.disableEditors();
      }
    }
    /* Persist changes from any "dirty" editors to the server. All editors that were dirty become non-dirty.
     */
    , saveEditors: function() {
      ContentEditor.disableSave();

      $.each(tinymce.EditorManager.editors, function(index, editor) {
        // isDirty returns true if the editor contents have been modified
        if (editor.isDirty()) {
          editor.save();

          var element = $(editor.getElement())
            , key = element.data('content-key')
            , locale = element.data('locale')
          ;

          $.ajax('/editor_content', {
            method: "POST",
            data: {
              key: key
            , value: editor.getContent()
            , locale: locale
            },
            error: function() {
              editor.setDirty(true);
              ContentEditor.enableSave();
              alert("Oops, something went wrong! Please try again later.");
            }
          });
        }
      });
    }
    /* Disable the save button
     */
    , disableSave: function() {
      var button = $('#SAVE_BUTTON');
      button.addClass('disabled');
      button.off('click');
    }
    /* Enable the save button
     */
    , enableSave: function() {
      var button = $('#SAVE_BUTTON');
      button.removeClass('disabled');
      button.click(ContentEditor.saveEditors)
    }
    /* True if the save button is enabled, false o/w
     */
    , isSaveEnabled: function() {
      return !$('#SAVE_BUTTON').hasClass('disabled');
    }
    /* Add the content editor controls to the dom. This function only has an effect the first time it is called 
     * on a given page.
     */
    , initControls: function() {
      if (!this._controlInitDone) {
        this._controlInitDone = true;

        $('body').append(
          '<div id="EDIT_CONTROL">' + 
            '<div id="EDIT_STATE_TEXT">Edit mode off</div>' +
            '<i class="fa fa-toggle-off fa-2x" id="EDIT_SWITCH"></i><br />' +
            '<i class="fa fa-floppy-o fa-2x disabled" id="SAVE_BUTTON"></i>' +
          '</div>'
        );

        $('#EDIT_CONTROL').draggable({ cursor: 'move' });
        $('#EDIT_SWITCH').click(ContentEditor.toggleEditMode);
        $(window).on('beforeunload', function() {
          if (ContentEditor.isSaveEnabled()) {
            return 'You currently have unsaved changes that will be lost if you leave this page.';
          }
        });
      }
    }
    /* For tinymce.init_instance_callback. Set up the editors and the global controls.
     */
    , initInstanceCallback: function(editor) {
      // start disabled
      editor.hide();

      editor.on('dirty', function() {
        ContentEditor.enableSave();
      });

      ContentEditor.initControls();
    }
    /* To be called once on a new page before any initialization has occurred.
     */
    , resetInitState: function() {
      this._controlInitDone = false;
    }
  }
}

$(function() {  
  ContentEditor.resetInitState();

  tinymce.init({
    selector: 'h1[data-editable="true"]',
    inline: true,
    plugins: 'paste',
    toolbar: 'undo redo',
    menubar: false,
    valid_styles: {
      '*': ''
    },
    valid_elements: '',
    init_instance_callback: ContentEditor.initInstanceCallback
  });

  tinymce.init({
    selector: 'div[data-editable="true"]',
    inline: true,
    plugins: 'paste link',
    toolbar: 'undo redo | bold italic | bullist | link',
    menubar: false,
    valid_styles: {
      '*': ''
    },
    valid_elements: 'a[href],strong/b,p,br,ul,li,em',
    init_instance_callback: ContentEditor.initInstanceCallback
  });
});
