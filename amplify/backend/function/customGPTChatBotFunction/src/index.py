import uuid
import message_repository
import json


def handler(event, context):
    print(event)
    # Parse the event body as a JSON object
    event_body = json.loads(event['body'])
    # input_text = event_body['userPromptText']
    input_text = event_body.get('userPromptText')
    print(f'event_body:{event_body}')
    print(f'input_text:{input_text}')
    session_id = event_body.get('sessionId')
    print(f'Received session_id:{session_id}')
    if input_text is None:
        return {
            "statusCode": 400,
            "body": json.dumps({"message": "メッセージを入力してください", 'sessionId': session_id})
        }
    if session_id is None:
        session_id = str(uuid.uuid4())
        print(f'create session_id:{session_id}')

    completed_text = message_repository.create_completed_text(session_id, input_text)
    print(f'completed_text:{completed_text}')
    response = {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",  # すべてのドメインからのアクセスを許可する場合
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
        },
        "body": json.dumps({"message": completed_text, 'sessionId': session_id})
    }
    return response
