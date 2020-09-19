import React from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';

const AssignRoute = () => {
    const [phoneData, setPhoneData] = React.useState([]);
    const [emailData, setEmailData] = React.useState([]);

    //copy link
    const copy = () => {
        document.getElementById('link').select();
        document.execCommand('copy');
        //e.target.focus(); //highlight selected text
        //this.setState({ copySuccess: 'Copied!' });
    };

    const addPhone = () => {
        let textfield = document.getElementById('phone');
        let p = textfield.value;
        if (p === "") { //TODO: validations
            return;
        } else if (phoneData.includes(p)) {
            return;
        } else if (p < 1000000000 || p > 9999999999) { //!Number.isInteger(p) not working?
            return;
        }
        setPhoneData([...phoneData, p]); //?setPhoneData([phoneData.push(p)]);
        //alert(phoneData);
        textfield.value = "";
    };

    const deletePhone = (data) => () => {
        setPhoneData((phoneData) => phoneData.filter((d) => d !== data));
    }

    const addEmail = () => {
        let textfield = document.getElementById('email');
        let p = textfield.value;
        if (p === "") {
            return;
        } else if (emailData.includes(p)) {
            return;
        } else if (!p.includes("@")) {//TODO: check email format
            return;
        }
        setEmailData([...emailData, p]); //?setPhoneData([phoneData.push(p)]);
        textfield.value = "";
    };

    const deleteEmail = (data) => () => {
        setEmailData((emailData) => emailData.filter((d) => d !== data));
    }

    //submit
    const assign = () => {
        let input = {
            group: document.getElementById('group').value,
            link: document.getElementById('link').value,
            phone_numbers: phoneData,
            emails: emailData
        }
        console.log(input);
    }

    return (
        <Box maxWidth="600px">
            <Typography variant="h4" gutterBottom>Assign Route</Typography>
            <TextField
                id="group"
                label="Group Name"
                helperText="Using volunteer database"
                fullWidth
                variant="filled"
                size='small'
                autoFocus
            />
            <br /><br />
            <div>
                <TextField
                    id="link"
                    label="Link"
                    defaultValue="www.cftkcanning.com/routes/example"
                    helperText="Using a link that anyone can access"
                    variant="filled"
                    InputProps={{
                        readOnly: true,
                    }}
                    size='small'
                    style={{ width: '85%' }}
                />
                <Button color="primary" size="large" onClick={copy}>COPY</Button>
            </div>
            <br />
            <div>
                <TextField
                    id="phone"
                    label="Phone Number"
                    placeholder="1234567890"
                    helperText="Using phone numbers"
                    variant="filled"
                    size='small'
                />
                <Button color="primary" size="large" onClick={addPhone}>ADD</Button>
                <Box>
                    {phoneData.map((data) => {
                        return (
                            <Chip
                                label={data}
                                onDelete={deletePhone(data)}
                                //className={classes.chip}
                                color="primary"
                                style={{ margin: 2 }}
                            />
                        );
                    })}
                </Box>
            </div>
            <br />
            <div>
                <TextField
                    id="email"
                    label="Email"
                    placeholder="example@example.com"
                    helperText="Using emails"
                    variant="filled"
                    size='small'
                    style={{ width: '85%' }}
                />
                <Button color="primary" size="large" onClick={addEmail}>ADD</Button>
                <Box>
                    {emailData.map((data) => {
                        return (
                            <Chip
                                label={data}
                                onDelete={deleteEmail(data)}
                                color="primary"
                                style={{ margin: 2 }}
                            />
                        );
                    })}
                </Box>
            </div>
            <br />
            <Grid container justify="flex-end">
                <Button variant="outlined" style={{ margin: 5 }}>CANCEL</Button>
                <Button variant="contained" color="primary" style={{ margin: 5 }} onClick={assign}>ASSIGN</Button>
            </Grid>
        </Box>

    );

};

export default AssignRoute;





/* text field format
    <TextField
    id="filled-full-width"
    label="Group Name"
    //style={{ margin: 8 }}
    //placeholder="www.cftkcanning.com/routes/linksenddrive"
    helperText="Using volunteer database"
    fullWidth
    //margin="normal"
    // InputLabelProps={{
    //     shrink: true,
    // }}
    variant="filled"
/> */