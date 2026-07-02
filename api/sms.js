export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, message } = req.body;

  if (!phone || !message) {
    return res.status(400).json({ error: 'Phone and message are required' });
  }

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.length < 10) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }

  const API_KEY = 'MPUAmkZ6uTVQ4yJj3gLO7HRzGsw0aSt5xIb8WcfhYedoKDpXlruwOjrvLMJTcqRd0nKWQosDkzH8thbS';

  try {
    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${API_KEY}&route=q&message=${encodeURIComponent(message)}&numbers=${cleanPhone}`;

    const response = await fetch(url);
    const data = await response.json();

    console.log('Fast2SMS response:', JSON.stringify(data));

    if (data.return === true) {
      return res.status(200).json({ success: true, message: 'SMS sent successfully', data });
    } else {
      return res.status(400).json({ success: false, error: data.message || 'SMS failed', data });
    }
  } catch (error) {
    console.error('SMS API error:', error);
    return res.status(500).json({ success: false, error: 'Failed to send SMS' });
  }
}
