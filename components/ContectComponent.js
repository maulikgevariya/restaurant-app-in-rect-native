import React, { Component } from 'react';
import { Card, Button, Icon } from 'react-native-elements';
import { View, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import * as MailComposer from 'expo-mail-composer';

class ContectComponent extends Component {

    static navigationOptions = {
        title: 'Contact Us'
    };

    sendMail() {
        MailComposer.composeAsync({
            recipients: ['confusion@food.net'],
            subject: 'Enquiry',
            body: 'To whom it may concern:'
        })
    }

    render() {
        return (
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
                <Card title ='Contact Information'>
                    <Text style={{margin: 5}}>121, Clear Water Bay Road</Text>
                    <Text style={{margin: 5}}>Clear Water Bay, Kowloon</Text>
                    <Text style={{margin: 5}}>HONG KONG</Text>
                    <Text style={{margin: 5}}>Tel: +852 1234 5678</Text>
                    <Text style={{margin: 5}}>Fax: +852 8765 4321</Text>
                    <Text style={{margin: 5}}>Email:confusion@food.net</Text>
                    <Button
                        title="Send Email"
                        buttonStyle={{backgroundColor: "#512DA8"}}
                        icon={<Icon name='envelope-o' type='font-awesome' color='white' marginRight={10} /> }
                        onPress={this.sendMail}
                        />
                </Card>
            </Animatable.View>
        );
    }
}

export default ContectComponent;