import express from 'express';

function createRequestOptions(bodyContent: any) {
    return {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'api-key': process.env.BREVO_API_KEY ?? ''
        },
        body: JSON.stringify(bodyContent)
    };
}

export const expressRouter = express.Router();

expressRouter.post('/register', async (req, res) => {
    try {
        const requestOptions = createRequestOptions({ updateEnabled: false, listIds: [2], email: req.body.mail });
        const response = await fetch('https://api.brevo.com/v3/contacts', requestOptions);
        const jsonResponse = await response.json();

        if (jsonResponse.code === 'duplicate_parameter') {
            const duplicateOptions = createRequestOptions({ emails: [req.body.mail], listIds: [2] });
            const duplicateResponse = await fetch('https://api.brevo.com/v3/contacts/lists/2/contacts/add', duplicateOptions);
            const duplicateJsonResponse = await duplicateResponse.json();
            console.log(duplicateJsonResponse);
        }

        res.status(200).send({
            success: true,
            message: 'email sent',
        });
    } catch (error) {
        console.error('Error occurred during registration:', error);
        res.status(500).send({
            success: false,
            message: 'An error occurred',
        });
    }
});
