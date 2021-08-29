import React, { useState, useRef, useCallback } from 'react'
import ReactTagsInput from 'react-tagsinput'
import classnames from 'classnames'

export const KEYS = {
  TAB: 9,
  ENTER: 13,
  SPACE: 32,
  COMMA: 188
}


function TagsInput({
  id,
  className = '',
  inputProps,
  disabled,
  value,
  onChange,
  showPlusButton=true,
  directionLeft=false,
  ...rest
}) {
  const [isOpen, setIsOpen] = useState(false)
  const anchorEl = useRef(null)
  const removeItemAt = useCallback((removeIdx) => {
    if (typeof onChange === 'function') {
      onChange(value.filter((v, idx) => idx !== removeIdx))
    }
  }, [value, onChange])

  return (
    <div className="base-tags-container" ref={anchorEl}>
      <div className='tags-tags-container'>
        {value.map((tag, idx) => {
          const { tagDisplayProp } = rest
          const tagDisplay = tagDisplayProp ? tag[tagDisplayProp] : tag
          return (
            <span key={`${tagDisplay}-${idx}`} className={classnames("tag-item", { disabled })}>
              {tagDisplay}
              {!disabled &&
                <span
                  className="btn-remove-tags"
                  onClick={() => removeItemAt(idx)}
                >
                  X
                </span>
              }
            </span>
          )
        })
        }
      </div>
     </div>
  )
}
export default React.memo(TagsInput)
