import React from 'react'

const MessageCenter = ({
  messagetypeType,
  content
}) => {
  return (
    <div className='mx-auto text-black text-bold'>
      <p>{content}</p>
    </div>
  )
}

export default MessageCenter
