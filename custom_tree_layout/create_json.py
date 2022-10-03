import json

tree = json.dumps({
    "txt": ["root"],
    "children":[
        {
            "txt": ["left child"]
        },
        {
            "txt": ["parent"],
            "children": [
                {
                    "txt": ["where"]
                },
                {
                    "txt": ["are you"]
                },
                {
                    "txt": ["from"],
                    "children": [
                        {
                            "txt": ["I"]
                        },
                        {
                            "txt": ["am"]
                        },
                        {
                            "txt": ["from"]
                        },
                        {
                            "txt": [""],
                            "children": [
                                {
                                    "txt": ["New"]
                                },
                                {
                                    "txt": ["Jersey"]
                                },
                                {
                                    "txt": ["US"]
                                }
                            ]
                        },
                        {
                            "txt": ["and you?"]
                        }
                    ]
                }
            ]
        }
    ]
})

with open("sample_tree.json", "w") as f_:
    print(tree, file=f_)