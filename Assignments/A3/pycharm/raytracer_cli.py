import sys
from raytracer_types import ProgressBar
from raytracer_io import file_exists


def validate_args() -> str:
    if len(sys.argv) != 2:
        print("Usage: python RayTracer.py <scene_file>")
        sys.exit(1)
    if not file_exists(sys.argv[1]):
        print(f"Error: File not found: '{sys.argv[1]}'")
        sys.exit(1)
    return sys.argv[1]


def progress(pb: ProgressBar, status: str = '') -> None:
    '''
    # The MIT License (MIT)
    # Copyright (c) 2016 Vladimir Ignatev
    #
    # Permission is hereby granted, free of charge, to any person obtaining
    # a copy of this software and associated documentation files (the "Software"),
    # to deal in the Software without restriction, including without limitation
    # the rights to use, copy, modify, merge, publish, distribute, sublicense,
    # and/or sell copies of the Software, and to permit persons to whom the Software
    # is furnished to do so, subject to the following conditions:
    #
    # The above copyright notice and this permission notice shall be included
    # in all copies or substantial portions of the Software.
    #
    # THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
    # INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
    # PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
    # FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
    # OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
    # OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    :param pb: progress bar object
    :param status: status message (unused)
    :return: None
    '''
    bar_len = 60
    filled_len = int(round(bar_len * pb.progress / float(pb.total)))

    percents = round(100.0 * pb.progress / float(pb.total), 1)
    bar = '#' * filled_len + '-' * (bar_len - filled_len)

    sys.stdout.write('|%s| %s%s %s\r' % (bar, percents, '%', status))
    sys.stdout.flush()  # As suggested by Rom Ruben (see: http://stackoverflow.com/questions/3173320/text-progress-bar-in-the-console/27871113#comment50529068_27871113)


def intro(input_file: str) -> None:
    print(rf'''
╭─────────────────╮         ____             ______                         
│ Dryden Bryson   │        / __ \____ ___  _/_  __/________ _________  _____
│ V01037593       │       / /_/ / __ `/ / / // / / ___/ __ `/ ___/ _ \/ ___/
│ ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ │      / _, _/ /_/ / /_/ // / / /  / /_/ / /__/  __/ /  
│ 03-26-2026      │     /_/ |_|\__,_/\__, //_/ /_/   \__,_/\___/\___/_/   
╰─────────────────╯                 /____/                                  

═══════════════════════════════════════════════════════════════════════════════
                 ╭──{"─"*len(input_file)}──╮
Rendering input: │ "{input_file}" │
                 ╰──{"─"*len(input_file)}──╯
═══════════════════════════════════════════════════════════════════════════════
''')
# text provided by https://patorjk.com/software/taag/


def progress_bar_setup(width: int, height: int) -> ProgressBar:
    total_pixels = width * height
    update_interval = max(1, total_pixels // 1000)
    return ProgressBar(total=total_pixels, update_interval=update_interval)


