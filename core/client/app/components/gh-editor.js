import Ember from 'ember';

const {Component, computed, run} = Ember;
const {equal} = computed;

export default Component.extend({
    tagName: 'section',
    classNames: ['gh-view'],

    showCopyHTMLModal: false,
    copyHTMLModalContent: null,

    // updated when gh-ed-editor component scrolls
    editorScrollInfo: null,
    // updated when markdown is rendered
    height: null,
    activeTab: 'markdown',

    markdownActive: equal('activeTab', 'markdown'),
    previewActive: equal('activeTab', 'preview'),

    // HTML Preview listens to scrollPosition and updates its scrollTop value
    // This property receives scrollInfo from the textEditor, and height from the preview pane, and will update the
    // scrollPosition value such that when either scrolling or typing-at-the-end of the text editor the preview pane
    // stays in sync
    scrollPosition: computed('editorScrollInfo', 'height', function () {
        let scrollInfo = this.get('editorScrollInfo');
        let $previewContent = this.get('$previewContent');
        let $previewViewPort = this.get('$previewViewPort');

        if (!scrollInfo || !$previewContent || !$previewViewPort) {
            return 0;
        }

        let previewHeight = $previewContent.height() - $previewViewPort.height();
        let previewPosition, ratio;

        ratio = previewHeight / scrollInfo.diff;
        previewPosition = scrollInfo.top * ratio;

        return previewPosition;
    }),

    scheduleAfterRender() {
        run.scheduleOnce('afterRender', this, this.afterRenderEvent);
    },

    didInsertElement() {
        this._super(...arguments);
        this.scheduleAfterRender();
    },

    afterRenderEvent() {
        let $previewViewPort = this.$('.js-entry-preview-content');

        // cache these elements for use in other methods
        this.set('$previewViewPort', $previewViewPort);
        this.set('$previewContent', this.$('.js-rendered-markdown'));
    },

    actions: {
        selectTab(tab) {
            this.set('activeTab', tab);
        },

        toggleCopyHTMLModal(generatedHTML) {
            this.set('copyHTMLModalContent', generatedHTML);
            this.toggleProperty('showCopyHTMLModal');
        }
    }
});
