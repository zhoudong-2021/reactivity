import React, { useState} from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';

interface Props {
    activity: Activity | undefined;
    submitting: boolean;
    onFormClose: () => void;
    onCreateOrEditActivity:(activity:Activity) => void;
}

export default function ActivityForm(
    { activity:selectedActivity, submitting, onFormClose, onCreateOrEditActivity }: Props) {

    const initialState = selectedActivity ?? {
        id:'',
        title:'',
        category:'',
        description:'',
        date:'',
        city:'',
        venue:'',

    }  

    const [activity, setActivity] = useState(initialState);

    const handleSubmit = () => {
        onCreateOrEditActivity(activity);
    }

    const handleInputChange=(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=> {
        const {name, value} = event.target;
        setActivity({...activity, [name]:value});
    }
    
    return (
        <Segment clearing>
            <Form
            onSubmit={handleSubmit}
            autoComplete='off'
            >
                <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleInputChange}/>
                <Form.TextArea placeholder='Description' value={activity.description} name='description' onChange={handleInputChange}/>
                <Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleInputChange}/>
                <Form.Input type='date' placeholder='Date' value={activity.date} name='date' onChange={handleInputChange}/>
                <Form.Input placeholder='City' value={activity.city} name='city' onChange={handleInputChange}/>
                <Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange}/>
                <Button
                    floated='right'
                    positive
                    type='submit'
                    content='submit'
                    loading={submitting}
                />
                <Button
                    floated='right'
                    type='button'
                    content='cancel'
                    onClick={onFormClose}
                />
            </Form>
        </Segment>
    )
}