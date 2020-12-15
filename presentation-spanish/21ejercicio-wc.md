# DESCRIPTION

The wc utility shall read one or more input files and, by default, write the number of <newline> characters, words, (and bytes) contained in each input file to the standard output.
The utility also shall write a total count for all named files, if more than one input file is specified.
The wc utility shall consider a word to be a non-zero-length string of characters delimited by white space.

## OPTIONS

The following options shall be supported:

- -c: Write to the standard output the number of bytes in each input file.
- -l: Write to the standard output the number of <newline> characters in each input file.
- -m: Write to the standard output the number of characters in each input file.
- -w: Write to the standard output the number of words in each input file.

When any option is specified, wc shall report only the information requested by the specified options.

## OPERANDS

The following operands shall be supported

### file
A pathname of an input file. If no file operands are specified, the standard input shall be used.

### STDOUT
By default, the standard output shall contain an entry for each input file of the form:

"%d %d %d %s\n", <newlines>, <words>, <bytes>, <file>

If the -m option is specified, the number of characters shall replace the <bytes> field in this format.

If any options are specified and the -l option is not specified, the number of <newline> characters shall not be written.

If any options are specified and the -w option is not specified, the number of words shall not be written.

If any options are specified and neither -c nor -m is specified, the number of bytes or characters shall not be written.

If no input file operands are specified, no name shall be written and no <blank> characters preceding the pathname shall be written.

If more than one input file operand is specified, an additional line shall be written, of the same format as the other lines, except that the word total (in the POSIX locale) shall be written instead of a pathname and the total of each column shall be written as appropriate. Such an additional line, if any, is written at the end of the output.

### STDERR
The standard error shall be used only for diagnostic messages.

### EXIT STATUS
The following exit values shall be returned:

 0
Successful completion.
\>0
An error occurred.
