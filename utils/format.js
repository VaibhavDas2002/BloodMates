export const formatDate = (_date, _placeholder) => {
    console.log({ _date, _placeholder })
    if (!_date) return _placeholder

    return new Date(_date).toDateString()
}
