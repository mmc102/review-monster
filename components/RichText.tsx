import { Dispatch, SetStateAction } from 'react';
import 'react-quill-new/dist/quill.snow.css'; // import styles
import ReactQuill from 'react-quill-new'


const modules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }, { 'direction': 'rtl' }],
    ],
};

const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background', 'align', 'direction', 'script',
];

const RichTextEditor = ({ value, onChange }: { value: string, onChange: Dispatch<SetStateAction<string>> }) => {
    return (
        <ReactQuill
            value={value}
            onChange={onChange}
            modules={modules}
            formats={formats}
            theme="snow"
            style={{ height: '300px' }}
        />
    );
};

export default RichTextEditor;
